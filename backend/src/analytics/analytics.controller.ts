import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AnalyticsController {
    constructor(private analyticsService: AnalyticsService) {}

    @Get('revenue')
    async getRevenueAnalytics(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        return this.analyticsService.getRevenueAnalytics(dateRange);
    }

    @Get('popular-movies')
    async getPopularMovies(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        return this.analyticsService.getPopularMovies(dateRange);
    }

    @Get('peak-hours')
    async getPeakBookingHours(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        return this.analyticsService.getPeakBookingHours(dateRange);
    }

    @Get('theater-occupancy')
    async getTheaterOccupancy(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        return this.analyticsService.getTheaterOccupancy(dateRange);
    }

    @Get('customer-insights')
    async getCustomerInsights(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string
    ) {
        const dateRange = {
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        };
        return this.analyticsService.getCustomerInsights(dateRange);
    }
}