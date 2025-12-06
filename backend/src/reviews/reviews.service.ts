import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovieReview } from './entities/movie-review.entity';
import { Movie } from '../movies/entities/movie.entity';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(MovieReview)
        private reviewsRepository: Repository<MovieReview>,
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) {}

    async createReview(userId: number, movieId: number, rating: number, comment: string) {
        const review = this.reviewsRepository.create({
            user: { id: userId },
            movie: { id: movieId },
            rating,
            comment
        });

        const savedReview = await this.reviewsRepository.save(review);
        await this.updateMovieRating(movieId);
        return savedReview;
    }

    async getMovieReviews(movieId: number) {
        return this.reviewsRepository.find({
            where: { movie: { id: movieId }, isVisible: true },
            order: { createdAt: 'DESC' }
        });
    }

    async getUserReviews(userId: number) {
        return this.reviewsRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' }
        });
    }

    private async updateMovieRating(movieId: number) {
        const reviews = await this.reviewsRepository.find({
            where: { movie: { id: movieId }, isVisible: true }
        });

        if (reviews.length > 0) {
            const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
            await this.moviesRepository.update(movieId, {
                averageRating: Math.round(averageRating * 10) / 10,
                totalReviews: reviews.length
            });
        }
    }

    async deleteReview(reviewId: number, userId: number) {
        const review = await this.reviewsRepository.findOne({
            where: { id: reviewId, user: { id: userId } }
        });

        if (review) {
            await this.reviewsRepository.remove(review);
            await this.updateMovieRating(review.movie.id);
            return true;
        }
        return false;
    }
}