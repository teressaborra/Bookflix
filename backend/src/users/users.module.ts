import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => BookingsModule)
    ],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService],
})
export class UsersModule { }
