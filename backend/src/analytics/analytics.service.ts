import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../bookings/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Show } from '../shows/entities/show.entity';
import { Theater } from '../theaters/entities/theater.entity';

interface DateRangeDto {
    startDate: Date;
    endDate: Date;
}

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        @InjectRepository(Show)
        private showsRepository: Repository<Show>,
        @InjectRepository(Theater)
        private theatersRepository: Repository<Theater>,
    ) {}

    async getRevenueAnalytics(dateRange: DateRangeDto) {
        const bookings = await this.bookingsRepository.find({
            where: {
                createdAt: Between(dateRange.startDate, dateRange.endDate),
                status: BookingStatus.CONFIRMED
            },
            relations: ['show', 'show.movie', 'show.theater']
        });

        const dailyRevenue = this.calculateDailyRevenue(bookings);
        const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.amountPaid), 0);
        const totalBookings = bookings.length;
        const averageBookingValue = totalRevenue / totalBookings || 0;

        return {
            totalRevenue,
            totalBookings,
            averageBookingValue,
            dailyRevenue,
            revenueGrowth: await this.calculateRevenueGrowth(dateRange)
        };
    }

    private calculateDailyRevenue(bookings: Booking[]) {
        const dailyData = new Map<string, number>();
        
        bookings.forEach(booking => {
            const date = booking.createdAt.toISOString().split('T')[0];
            dailyData.set(date, (dailyData.get(date) || 0) + Number(booking.amountPaid));
        });

        return Array.from(dailyData.entries()).map(([date, revenue]) => ({
            date,
            revenue
        })).sort((a, b) => a.date.localeCompare(b.date));
    }

    async getPopularMovies(dateRange: DateRangeDto) {
        const result = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.show', 'show')
            .leftJoin('show.movie', 'movie')
            .select('movie.id', 'movieId')
            .addSelect('movie.title', 'title')
            .addSelect('COUNT(booking.id)', 'bookingCount')
            .addSelect('SUM(booking.amountPaid)', 'totalRevenue')
            .where('booking.createdAt BETWEEN :startDate AND :endDate', dateRange)
            .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
            .groupBy('movie.id')
            .addGroupBy('movie.title')
            .orderBy('bookingCount', 'DESC')
            .limit(10)
            .getRawMany();

        return result.map(item => ({
            movieId: item.movieId,
            title: item.title,
            bookingCount: parseInt(item.bookingCount),
            totalRevenue: parseFloat(item.totalRevenue)
        }));
    }

    async getPeakBookingHours(dateRange: DateRangeDto) {
        const bookings = await this.bookingsRepository.find({
            where: {
                createdAt: Between(dateRange.startDate, dateRange.endDate),
                status: BookingStatus.CONFIRMED
            }
        });

        const hourlyData = new Map<number, number>();
        
        bookings.forEach(booking => {
            const hour = booking.createdAt.getHours();
            hourlyData.set(hour, (hourlyData.get(hour) || 0) + 1);
        });

        return Array.from(hourlyData.entries()).map(([hour, count]) => ({
            hour,
            bookingCount: count
        })).sort((a, b) => a.hour - b.hour);
    }

    async getTheaterOccupancy(dateRange: DateRangeDto) {
        const shows = await this.showsRepository.find({
            where: {
                startTime: Between(dateRange.startDate, dateRange.endDate)
            },
            relations: ['theater', 'bookings']
        });

        const theaterData = new Map<number, { name: string; totalShows: number; totalSeats: number; bookedSeats: number }>();

        shows.forEach(show => {
            const theaterId = show.theater.id;
            const theaterName = show.theater.name;
            
            if (!theaterData.has(theaterId)) {
                theaterData.set(theaterId, {
                    name: theaterName,
                    totalShows: 0,
                    totalSeats: 0,
                    bookedSeats: 0
                });
            }

            const data = theaterData.get(theaterId)!;
            data.totalShows += 1;
            data.totalSeats += show.totalSeats;
            data.bookedSeats += show.bookedSeats;
        });

        return Array.from(theaterData.entries()).map(([theaterId, data]) => ({
            theaterId,
            theaterName: data.name,
            totalShows: data.totalShows,
            occupancyRate: data.totalSeats > 0 ? (data.bookedSeats / data.totalSeats) * 100 : 0,
            totalRevenue: 0 // Would need to calculate from bookings
        }));
    }

    private async calculateRevenueGrowth(dateRange: DateRangeDto) {
        const currentPeriodDays = Math.ceil((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24));
        const previousStartDate = new Date(dateRange.startDate.getTime() - (currentPeriodDays * 24 * 60 * 60 * 1000));
        
        const currentRevenue = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('SUM(booking.amountPaid)', 'total')
            .where('booking.createdAt BETWEEN :startDate AND :endDate', dateRange)
            .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
            .getRawOne();

        const previousRevenue = await this.bookingsRepository
            .createQueryBuilder('booking')
            .select('SUM(booking.amountPaid)', 'total')
            .where('booking.createdAt BETWEEN :startDate AND :endDate', {
                startDate: previousStartDate,
                endDate: dateRange.startDate
            })
            .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
            .getRawOne();

        const current = parseFloat(currentRevenue.total) || 0;
        const previous = parseFloat(previousRevenue.total) || 0;
        
        return previous > 0 ? ((current - previous) / previous) * 100 : 0;
    }

    async getCustomerInsights(dateRange: DateRangeDto) {
        const newCustomers = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.user', 'user')
            .select('COUNT(DISTINCT user.id)', 'count')
            .where('user.createdAt BETWEEN :startDate AND :endDate', dateRange)
            .getRawOne();

        const repeatCustomers = await this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoin('booking.user', 'user')
            .select('COUNT(DISTINCT user.id)', 'count')
            .where('booking.createdAt BETWEEN :startDate AND :endDate', dateRange)
            .andWhere('user.createdAt < :startDate', { startDate: dateRange.startDate })
            .getRawOne();

        return {
            newCustomers: parseInt(newCustomers.count),
            repeatCustomers: parseInt(repeatCustomers.count),
            customerRetentionRate: 0 // Would need more complex calculation
        };
    }
}