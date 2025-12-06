import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) {}

    @UseGuards(JwtAuthGuard)
    @Post()
    async createReview(
        @Request() req,
        @Body() body: { movieId: number; rating: number; comment: string }
    ) {
        return this.reviewsService.createReview(
            req.user.sub,
            body.movieId,
            body.rating,
            body.comment
        );
    }

    @Get('movie/:movieId')
    async getMovieReviews(@Param('movieId') movieId: number) {
        return this.reviewsService.getMovieReviews(movieId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('user')
    async getUserReviews(@Request() req) {
        return this.reviewsService.getUserReviews(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':reviewId')
    async deleteReview(@Param('reviewId') reviewId: number, @Request() req) {
        return this.reviewsService.deleteReview(reviewId, req.user.sub);
    }
}