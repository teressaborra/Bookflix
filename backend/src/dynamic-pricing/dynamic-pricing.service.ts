import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from '../shows/entities/show.entity';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';

@Injectable()
export class DynamicPricingService {
    constructor(
        @InjectRepository(Show)
        private showsRepository: Repository<Show>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) {}

    async updateShowPricing(showId: number): Promise<number> {
        const show = await this.showsRepository.findOne({ 
            where: { id: showId },
            relations: ['bookings']
        });

        if (!show) throw new Error('Show not found');

        const currentBookings = await this.bookingsRepository.count({
            where: { 
                show: { id: showId },
                status: BookingStatus.CONFIRMED
            }
        });

        const occupancyRate = currentBookings / show.totalSeats;
        const newPrice = this.calculateDynamicPrice(show, occupancyRate);

        await this.showsRepository.update(showId, {
            currentPrice: newPrice,
            priceMultiplier: newPrice / Number(show.basePrice),
            bookedSeats: currentBookings
        });

        return newPrice;
    }

    private calculateDynamicPrice(show: Show, occupancyRate: number): number {
        let multiplier = 1.0;
        const basePrice = Number(show.basePrice);

        // Base demand pricing
        if (occupancyRate > 0.8) {
            multiplier = 1.5; // 50% increase when 80%+ full
        } else if (occupancyRate > 0.6) {
            multiplier = 1.3; // 30% increase when 60%+ full
        } else if (occupancyRate > 0.4) {
            multiplier = 1.15; // 15% increase when 40%+ full
        } else if (occupancyRate < 0.2) {
            multiplier = 0.9; // 10% discount when less than 20% full
        }

        // Time-based pricing
        const now = new Date();
        const showTime = new Date(show.startTime);
        const hoursUntilShow = (showTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursUntilShow < 2) {
            multiplier *= 1.2; // Last-minute booking premium
        } else if (hoursUntilShow > 168) { // More than a week
            multiplier *= 0.95; // Early bird discount
        }

        // Day of week pricing
        const dayOfWeek = showTime.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6) { // Friday or Saturday
            multiplier *= 1.1; // Weekend premium
        }

        // Time of day pricing
        const hour = showTime.getHours();
        if (hour >= 18 && hour <= 22) { // Prime time (6 PM - 10 PM)
            multiplier *= 1.05; // Prime time premium
        }

        // Premium show pricing
        if (show.isPremium) {
            multiplier *= 1.25;
        }

        // Special screening pricing
        if (show.isSpecialScreening) {
            multiplier *= 1.4;
        }

        // New release pricing
        if (show.movie.isNewRelease) {
            multiplier *= 1.15;
        }

        return Math.round(basePrice * multiplier * 100) / 100; // Round to 2 decimal places
    }

    async getPricingHistory(showId: number) {
        // This would typically come from a pricing history table
        // For now, we'll return current pricing info
        const show = await this.showsRepository.findOne({ where: { id: showId } });
        if (!show) throw new Error('Show not found');

        return {
            showId,
            basePrice: show.basePrice,
            currentPrice: show.currentPrice,
            priceMultiplier: show.priceMultiplier,
            occupancyRate: show.bookedSeats / show.totalSeats,
            lastUpdated: new Date()
        };
    }

    async getAllShowsPricing() {
        const shows = await this.showsRepository.createQueryBuilder('show')
            .leftJoinAndSelect('show.movie', 'movie')
            .leftJoinAndSelect('show.theater', 'theater')
            .where('show.startTime >= :now', { now: new Date() })
            .getMany();

        return Promise.all(shows.map(async (show) => {
            const currentBookings = await this.bookingsRepository.count({
                where: { 
                    show: { id: show.id },
                    status: BookingStatus.CONFIRMED
                }
            });

            return {
                showId: show.id,
                movieTitle: show.movie.title,
                theaterName: show.theater.name,
                startTime: show.startTime,
                basePrice: show.basePrice,
                currentPrice: show.currentPrice,
                occupancyRate: currentBookings / show.totalSeats,
                availableSeats: show.totalSeats - currentBookings
            };
        }));
    }

    async predictOptimalPrice(showId: number): Promise<number> {
        const show = await this.showsRepository.findOne({ where: { id: showId } });
        if (!show) throw new Error('Show not found');

        // Simple prediction based on similar shows
        // In a real implementation, this would use ML algorithms
        const similarShows = await this.showsRepository.createQueryBuilder('show')
            .leftJoinAndSelect('show.movie', 'movie')
            .where('movie.genre = :genre', { genre: show.movie.genre })
            .andWhere('show.startTime >= :now', { now: new Date() })
            .take(10)
            .getMany();

        const avgOccupancy = similarShows.reduce((sum, s) => sum + (s.bookedSeats / s.totalSeats), 0) / similarShows.length;
        return this.calculateDynamicPrice(show, avgOccupancy);
    }
}