import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeatRecommendationsService } from './seat-recommendations.service';
import { SeatRecommendationsController } from './seat-recommendations.controller';
import { Show } from '../shows/entities/show.entity';
import { ReservedSeat } from '../bookings/entities/reserved-seat.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Show, ReservedSeat])],
    providers: [SeatRecommendationsService],
    controllers: [SeatRecommendationsController],
    exports: [SeatRecommendationsService],
})
export class SeatRecommendationsModule {}