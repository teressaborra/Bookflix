import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MovieReview } from './entities/movie-review.entity';
import { Movie } from '../movies/entities/movie.entity';

@Module({
    imports: [TypeOrmModule.forFeature([MovieReview, Movie])],
    providers: [ReviewsService],
    controllers: [ReviewsController],
    exports: [ReviewsService],
})
export class ReviewsModule {}