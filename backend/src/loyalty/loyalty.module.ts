import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyService } from './loyalty.service';
import { LoyaltyController } from './loyalty.controller';
import { UserPoints } from './entities/user-points.entity';

@Module({
    imports: [TypeOrmModule.forFeature([UserPoints])],
    providers: [LoyaltyService],
    controllers: [LoyaltyController],
    exports: [LoyaltyService],
})
export class LoyaltyModule {}