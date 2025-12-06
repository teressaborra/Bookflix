import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../movies/entities/movie.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UserPreference } from '../preferences/entities/user-preference.entity';
import { Show } from '../shows/entities/show.entity';

@Injectable()
export class RecommendationsService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(UserPreference)
        private preferencesRepository: Repository<UserPreference>,
        @InjectRepository(Show)
        private showsRepository: Repository<Show>,
    ) {}

    async getPersonalizedRecommendations(userId: number): Promise<Movie[]> {
        const userBookings = await this.getUserBookingHistory(userId);
        const userPreferences = await this.preferencesRepository.findOne({
            where: { user: { id: userId } }
        });

        const preferredGenres = this.analyzeGenrePreferences(userBookings, userPreferences || undefined);
        const preferredTimes = this.analyzeTimePreferences(userBookings);

        return this.findSimilarMovies(preferredGenres, preferredTimes);
    }

    private async getUserBookingHistory(userId: number): Promise<Booking[]> {
        return this.bookingsRepository.find({
            where: { user: { id: userId } },
            relations: ['show', 'show.movie'],
            order: { createdAt: 'DESC' },
            take: 20 // Last 20 bookings
        });
    }

    private analyzeGenrePreferences(bookings: Booking[], preferences?: UserPreference): string[] {
        const genreCount = new Map<string, number>();

        // Analyze booking history
        bookings.forEach(booking => {
            const genre = booking.show.movie.genre;
            genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
        });

        // Include user preferences
        if (preferences?.favoriteGenres) {
            preferences.favoriteGenres.forEach(genre => {
                genreCount.set(genre, (genreCount.get(genre) || 0) + 3); // Weight preferences higher
            });
        }

        // Return top 3 genres
        return Array.from(genreCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([genre]) => genre);
    }

    private analyzeTimePreferences(bookings: Booking[]): string[] {
        const timeSlots = ['morning', 'afternoon', 'evening', 'night'];
        const timeCount = new Map<string, number>();

        bookings.forEach(booking => {
            const hour = new Date(booking.show.startTime).getHours();
            let timeSlot: string;
            
            if (hour < 12) timeSlot = 'morning';
            else if (hour < 17) timeSlot = 'afternoon';
            else if (hour < 21) timeSlot = 'evening';
            else timeSlot = 'night';

            timeCount.set(timeSlot, (timeCount.get(timeSlot) || 0) + 1);
        });

        return Array.from(timeCount.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 2)
            .map(([time]) => time);
    }

    private async findSimilarMovies(preferredGenres: string[], preferredTimes: string[]): Promise<Movie[]> {
        const queryBuilder = this.moviesRepository.createQueryBuilder('movie')
            .leftJoinAndSelect('movie.shows', 'show')
            .where('movie.genre IN (:...genres)', { genres: preferredGenres })
            .andWhere('show.startTime > :now', { now: new Date() })
            .orderBy('movie.averageRating', 'DESC')
            .addOrderBy('movie.totalReviews', 'DESC')
            .take(10);

        return queryBuilder.getMany();
    }

    async getTrendingMovies(): Promise<Movie[]> {
        return this.moviesRepository.createQueryBuilder('movie')
            .leftJoinAndSelect('movie.shows', 'show')
            .leftJoin('show.bookings', 'booking')
            .where('show.startTime > :weekAgo', { weekAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) })
            .groupBy('movie.id')
            .orderBy('COUNT(booking.id)', 'DESC')
            .addOrderBy('movie.averageRating', 'DESC')
            .take(10)
            .getMany();
    }

    async getNewReleases(): Promise<Movie[]> {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        
        return this.moviesRepository.find({
            where: { isNewRelease: true },
            order: { releaseDate: 'DESC' },
            take: 10
        });
    }

    async getSimilarMovies(movieId: number): Promise<Movie[]> {
        const movie = await this.moviesRepository.findOne({ where: { id: movieId } });
        if (!movie) return [];

        return this.moviesRepository.createQueryBuilder('movie')
            .where('movie.genre = :genre', { genre: movie.genre })
            .andWhere('movie.id != :movieId', { movieId })
            .orderBy('movie.averageRating', 'DESC')
            .take(5)
            .getMany();
    }
}