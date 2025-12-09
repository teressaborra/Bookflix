import { Injectable, BadRequestException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Show } from '../shows/entities/show.entity';
import { User } from '../users/entities/user.entity';
import { LoyaltyService } from '../loyalty/loyalty.service';
import { DynamicPricingService } from '../dynamic-pricing/dynamic-pricing.service';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(ReservedSeat)
        private reservedSeatsRepository: Repository<ReservedSeat>,
        private dataSource: DataSource,
        @Inject(forwardRef(() => LoyaltyService))
        private loyaltyService: LoyaltyService,
        @Inject(forwardRef(() => DynamicPricingService))
        private dynamicPricingService: DynamicPricingService,
    ) { }

    async create(userId: number, createBookingDto: CreateBookingDto) {
        const { showId, seats, pointsToRedeem } = createBookingDto;

        try {
            return await this.dataSource.transaction(async (manager) => {
                console.log('Starting booking transaction for user:', userId, 'show:', showId, 'seats:', seats);

                // 1. Check if show exists
                const show = await manager.findOne(Show, { 
                    where: { id: showId },
                    relations: ['movie', 'theater']
                });
                if (!show) {
                    throw new NotFoundException('Show not found');
                }
                console.log('Show found:', show.id, show.movie?.title);

                // 2. Check if seats are already reserved
                const existingSeats = await manager.find(ReservedSeat, {
                    where: {
                        show: { id: showId },
                        seatNo: In(seats),
                    },
                });

                if (existingSeats.length > 0) {
                    throw new BadRequestException(`Seats ${existingSeats.map(s => s.seatNo).join(', ')} are already booked`);
                }
                console.log('Seats are available');

                // 3. Calculate total amount (simplified - no dynamic pricing for now)
                const pricePerSeat = Number(show.currentPrice || show.basePrice || 0);
                let totalAmount = seats.length * pricePerSeat;
                let discount = 0;
                let pointsUsed = 0;

                console.log('Price calculation:', { pricePerSeat, totalAmount, seats: seats.length });

                // 4. Apply points redemption if requested (simplified)
                if (pointsToRedeem && pointsToRedeem > 0) {
                    try {
                        // Simplified points redemption - 1 point = $0.01
                        discount = Math.min(pointsToRedeem * 0.01, totalAmount);
                        pointsUsed = pointsToRedeem;
                        totalAmount -= discount;
                        console.log('Points applied:', { pointsToRedeem, discount, newTotal: totalAmount });
                    } catch (error) {
                        console.log('Points redemption failed:', error);
                        // Continue without points if there's an issue
                    }
                }

                // 5. Get user
                const user = await manager.findOne(User, { where: { id: userId } });
                if (!user) {
                    throw new NotFoundException('User not found');
                }
                console.log('User found:', user.id, user.name);

                // 6. Create Booking
                const booking = manager.create(Booking, {
                    user,
                    show,
                    seats,
                    amountPaid: totalAmount,
                    pointsUsed,
                    paymentMethod: createBookingDto.paymentMethod || 'card',
                    transactionId: `TXN_${Date.now()}_${userId}`,
                    pointsEarned: Math.floor(totalAmount * 0.1), // 10% of amount as points
                });
                const savedBooking = await manager.save(booking);
                console.log('Booking created:', savedBooking.id);

                // 7. Create ReservedSeat rows
                const reservedSeats = seats.map(seatNo => manager.create(ReservedSeat, {
                    show,
                    seatNo,
                    booking: savedBooking,
                }));
                await manager.save(reservedSeats);
                console.log('Reserved seats created:', reservedSeats.length);

                // 8. Update show's booked seats count
                await manager.update(Show, showId, {
                    bookedSeats: show.bookedSeats + seats.length
                });
                console.log('Show updated with new booked seats count');

                return {
                    ...savedBooking,
                    pointsEarned: savedBooking.pointsEarned,
                    discount,
                    originalAmount: seats.length * pricePerSeat
                };
            });
        } catch (error) {
            console.error('Booking creation failed:', error);
            throw error;
        }
    }

    async findUserBookings(userId: number) {
        return this.bookingsRepository.find({
            where: { user: { id: userId } },
            relations: ['show', 'show.movie', 'show.theater'],
            order: { id: 'DESC' }
        });
    }

    async findAll() {
        return this.bookingsRepository.find({
            relations: ['user', 'show', 'show.movie'],
            order: { id: 'DESC' }
        });
    }

    async cancelBooking(bookingId: number, userId: number, reason?: string) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, user: { id: userId } },
            relations: ['show', 'show.movie', 'reservedSeats']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Booking cannot be cancelled');
        }

        const hoursUntilShow = this.getHoursUntilShow(booking.show);
        const refundPercentage = this.calculateRefundPercentage(hoursUntilShow);
        const refundAmount = Number(booking.amountPaid) * refundPercentage;

        return this.dataSource.transaction(async (manager) => {
            // Update booking status
            await manager.update(Booking, bookingId, {
                status: BookingStatus.CANCELLED,
                cancellationReason: reason,
                refundPercentage,
                refundAmount
            });

            // Remove reserved seats
            await manager.remove(booking.reservedSeats);

            // Refund loyalty points if used
            if (booking.pointsUsed > 0) {
                const userPoints = await this.loyaltyService.getUserPoints(userId);
                userPoints.availablePoints += booking.pointsUsed;
                await manager.save(userPoints);
            }

            // Update show pricing
            await this.dynamicPricingService.updateShowPricing(booking.show.id);

            return {
                bookingId,
                refundAmount,
                refundPercentage,
                message: `Booking cancelled. Refund of $${refundAmount.toFixed(2)} will be processed.`
            };
        });
    }

    async rescheduleBooking(bookingId: number, userId: number, newShowId: number) {
        const originalBooking = await this.bookingsRepository.findOne({
            where: { id: bookingId, user: { id: userId } },
            relations: ['show', 'show.movie', 'reservedSeats']
        });

        if (!originalBooking) {
            throw new NotFoundException('Original booking not found');
        }

        if (originalBooking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Booking cannot be rescheduled');
        }

        const newShow = await this.dataSource.getRepository(Show).findOne({
            where: { id: newShowId },
            relations: ['movie']
        });

        if (!newShow) {
            throw new NotFoundException('New show not found');
        }

        // Check if same movie
        if (originalBooking.show.movie.id !== newShow.movie.id) {
            throw new BadRequestException('Can only reschedule to the same movie');
        }

        return this.dataSource.transaction(async (manager) => {
            // Check seat availability for new show
            const existingSeats = await manager.find(ReservedSeat, {
                where: {
                    show: { id: newShowId },
                    seatNo: In(originalBooking.seats),
                },
            });

            if (existingSeats.length > 0) {
                throw new BadRequestException(`Seats ${existingSeats.map(s => s.seatNo).join(', ')} are not available for the new show`);
            }

            // Calculate price difference
            const priceDifference = Number(newShow.currentPrice) - Number(originalBooking.show.currentPrice);
            const newAmount = Number(originalBooking.amountPaid) + (priceDifference * originalBooking.seats.length);

            // Mark original booking as rescheduled
            await manager.update(Booking, bookingId, {
                status: BookingStatus.RESCHEDULED
            });

            // Remove old reserved seats
            await manager.remove(originalBooking.reservedSeats);

            // Create new booking
            const newBooking = manager.create(Booking, {
                user: originalBooking.user,
                show: newShow,
                seats: originalBooking.seats,
                amountPaid: newAmount,
                originalBookingId: bookingId,
                paymentMethod: originalBooking.paymentMethod,
                transactionId: `RSCH_${Date.now()}_${userId}`,
            });
            const savedNewBooking = await manager.save(newBooking);

            // Create new reserved seats
            const newReservedSeats = originalBooking.seats.map(seatNo => manager.create(ReservedSeat, {
                show: newShow,
                seatNo,
                booking: savedNewBooking,
            }));
            await manager.save(newReservedSeats);

            // Update pricing for both shows
            await this.dynamicPricingService.updateShowPricing(originalBooking.show.id);
            await this.dynamicPricingService.updateShowPricing(newShowId);

            return {
                newBookingId: savedNewBooking.id,
                priceDifference,
                newAmount,
                message: priceDifference > 0 
                    ? `Booking rescheduled. Additional payment of $${priceDifference.toFixed(2)} required.`
                    : priceDifference < 0
                    ? `Booking rescheduled. Refund of $${Math.abs(priceDifference).toFixed(2)} will be processed.`
                    : 'Booking rescheduled successfully.'
            };
        });
    }

    private getHoursUntilShow(show: Show): number {
        const now = new Date();
        const showTime = new Date(show.startTime);
        return (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    }

    private calculateRefundPercentage(hoursUntilShow: number): number {
        if (hoursUntilShow > 24) return 0.9; // 90% refund if more than 24 hours
        if (hoursUntilShow > 2) return 0.5;  // 50% refund if more than 2 hours
        return 0; // No refund if less than 2 hours
    }

    async getBookingHistory(userId: number) {
        const bookings = await this.bookingsRepository.find({
            where: { user: { id: userId } },
            relations: ['show', 'show.movie', 'show.theater', 'reservedSeats'],
            order: { createdAt: 'DESC' }
        });

        return bookings.map(booking => ({
            ...booking,
            canCancel: this.canCancelBooking(booking),
            canReschedule: this.canRescheduleBooking(booking)
        }));
    }

    async getBookingDetails(bookingId: number, userId: number) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId, user: { id: userId } },
            relations: ['show', 'show.movie', 'show.theater', 'reservedSeats']
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        return {
            ...booking,
            canCancel: this.canCancelBooking(booking),
            canReschedule: this.canRescheduleBooking(booking)
        };
    }

    private canCancelBooking(booking: Booking): boolean {
        if (booking.status !== BookingStatus.CONFIRMED) return false;
        const hoursUntilShow = this.getHoursUntilShow(booking.show);
        return hoursUntilShow > 0; // Can cancel until show starts
    }

    private canRescheduleBooking(booking: Booking): boolean {
        if (booking.status !== BookingStatus.CONFIRMED) return false;
        const hoursUntilShow = this.getHoursUntilShow(booking.show);
        return hoursUntilShow > 2; // Can reschedule until 2 hours before show
    }
}