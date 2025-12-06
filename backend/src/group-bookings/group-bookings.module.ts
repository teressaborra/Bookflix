import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupBooking } from './entities/group-booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([GroupBooking])],
    exports: [TypeOrmModule],
})
export class GroupBookingsModule {}