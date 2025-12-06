import { Controller, Get, Query, Param } from '@nestjs/common';
import { SeatRecommendationsService } from './seat-recommendations.service';

@Controller('seat-recommendations')
export class SeatRecommendationsController {
    constructor(private seatRecommendationsService: SeatRecommendationsService) {}

    @Get(':showId')
    async getRecommendedSeats(
        @Param('showId') showId: number,
        @Query('groupSize') groupSize: number = 1
    ) {
        return this.seatRecommendationsService.getRecommendedSeats(showId, groupSize);
    }

    @Get(':showId/seat-map')
    async getSeatMap(@Param('showId') showId: number) {
        return this.seatRecommendationsService.getSeatMap(showId);
    }
}