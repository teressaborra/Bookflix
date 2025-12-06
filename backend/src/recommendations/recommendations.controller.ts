import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recommendations')
export class RecommendationsController {
    constructor(private recommendationsService: RecommendationsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('personalized')
    async getPersonalizedRecommendations(@Request() req) {
        return this.recommendationsService.getPersonalizedRecommendations(req.user.sub);
    }

    @Get('trending')
    async getTrendingMovies() {
        return this.recommendationsService.getTrendingMovies();
    }

    @Get('new-releases')
    async getNewReleases() {
        return this.recommendationsService.getNewReleases();
    }

    @Get('similar/:movieId')
    async getSimilarMovies(@Param('movieId') movieId: number) {
        return this.recommendationsService.getSimilarMovies(movieId);
    }
}