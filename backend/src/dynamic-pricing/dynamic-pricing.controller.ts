import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { DynamicPricingService } from './dynamic-pricing.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('pricing')
export class DynamicPricingController {
    constructor(private dynamicPricingService: DynamicPricingService) {}

    @Get('show/:showId')
    async getShowPricing(@Param('showId') showId: number) {
        return this.dynamicPricingService.getPricingHistory(showId);
    }

    @Get('all-shows')
    async getAllShowsPricing() {
        return this.dynamicPricingService.getAllShowsPricing();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post('update/:showId')
    async updateShowPricing(@Param('showId') showId: number) {
        return this.dynamicPricingService.updateShowPricing(showId);
    }

    @Get('predict/:showId')
    async predictOptimalPrice(@Param('showId') showId: number) {
        return this.dynamicPricingService.predictOptimalPrice(showId);
    }
}