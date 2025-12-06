import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { LoyaltyService } from './loyalty.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('loyalty')
export class LoyaltyController {
    constructor(private loyaltyService: LoyaltyService) {}

    @UseGuards(JwtAuthGuard)
    @Get('points')
    async getUserPoints(@Request() req) {
        return this.loyaltyService.getUserPoints(req.user.sub);
    }

    @UseGuards(JwtAuthGuard)
    @Post('redeem')
    async redeemPoints(@Request() req, @Body() body: { points: number }) {
        return this.loyaltyService.redeemPoints(req.user.sub, body.points);
    }

    @UseGuards(JwtAuthGuard)
    @Get('benefits')
    async getTierBenefits(@Request() req) {
        const userPoints = await this.loyaltyService.getUserPoints(req.user.sub);
        return this.loyaltyService.getTierBenefits(userPoints.tier);
    }
}