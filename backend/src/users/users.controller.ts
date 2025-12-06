import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingsService } from '../bookings/bookings.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(
        private readonly bookingsService: BookingsService,
    ) {}

    @Get('me/bookings')
    async getMyBookings(@Request() req) {
        return this.bookingsService.getBookingHistory(req.user.sub);
    }
}