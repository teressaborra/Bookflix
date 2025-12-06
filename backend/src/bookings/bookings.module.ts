import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { ReservedSeat } from './entities/reserved-seat.entity';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { DynamicPricingModule } from '../dynamic-pricing/dynamic-pricing.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Booking, ReservedSeat]),
        forwardRef(() => LoyaltyModule),
        forwardRef(() => DynamicPricingModule),
    ],
    controllers: [BookingsController],
    providers: [BookingsService],
    exports: [BookingsService],
})
export class BookingsModule { }
