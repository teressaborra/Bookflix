import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Post()
    create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
        return this.bookingsService.create(req.user.sub, createBookingDto);
    }

    @Get('my')
    findMyBookings(@Request() req) {
        return this.bookingsService.getBookingHistory(req.user.sub);
    }

    @Get(':id')
    getBookingDetails(@Param('id') id: number, @Request() req) {
        return this.bookingsService.getBookingDetails(id, req.user.sub);
    }

    @Put(':id/cancel')
    cancelBooking(
        @Param('id') id: number, 
        @Request() req,
        @Body() body: { reason?: string }
    ) {
        return this.bookingsService.cancelBooking(id, req.user.sub, body.reason);
    }

    @Put(':id/reschedule')
    rescheduleBooking(
        @Param('id') id: number,
        @Request() req,
        @Body() body: { newShowId: number }
    ) {
        return this.bookingsService.rescheduleBooking(id, req.user.sub, body.newShowId);
    }

    @Get()
    @UseGuards(RolesGuard)
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.bookingsService.findAll();
    }
}
