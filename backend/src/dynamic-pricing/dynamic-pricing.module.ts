import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicPricingService } from './dynamic-pricing.service';
import { DynamicPricingController } from './dynamic-pricing.controller';
import { Show } from '../shows/entities/show.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Show, Booking])],
    providers: [DynamicPricingService],
    controllers: [DynamicPricingController],
    exports: [DynamicPricingService],
})
export class DynamicPricingModule {}