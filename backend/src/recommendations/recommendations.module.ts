import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecommendationsService } from './recommendations.service';
import { RecommendationsController } from './recommendations.controller';
import { Movie } from '../movies/entities/movie.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { UserPreference } from '../preferences/entities/user-preference.entity';
import { Show } from '../shows/entities/show.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Movie, Booking, UserPreference, Show])],
    providers: [RecommendationsService],
    controllers: [RecommendationsController],
    exports: [RecommendationsService],
})
export class RecommendationsModule {}