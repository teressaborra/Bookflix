import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Booking } from '../bookings/entities/booking.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Show } from '../shows/entities/show.entity';
import { Theater } from '../theaters/entities/theater.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Movie, Show, Theater])],
    providers: [AnalyticsService],
    controllers: [AnalyticsController],
    exports: [AnalyticsService],
})
export class AnalyticsModule {}