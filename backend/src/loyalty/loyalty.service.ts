import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoints, LoyaltyTier } from './entities/user-points.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Injectable()
export class LoyaltyService {
    constructor(
        @InjectRepository(UserPoints)
        private userPointsRepository: Repository<UserPoints>,
    ) {}

    async getUserPoints(userId: number): Promise<UserPoints> {
        let userPoints = await this.userPointsRepository.findOne({
            where: { user: { id: userId } }
        });

        if (!userPoints) {
            userPoints = this.userPointsRepository.create({
                user: { id: userId },
                totalPoints: 0,
                availablePoints: 0,
                tier: LoyaltyTier.BRONZE,
                totalBookings: 0,
                totalSpent: 0
            });
            await this.userPointsRepository.save(userPoints);
        }

        return userPoints;
    }

    async calculatePoints(booking: Booking): Promise<number> {
        const basePoints = Math.floor(Number(booking.amountPaid) * 0.1); // 10% of amount as points
        const movieReleaseBonus = booking.show.movie.isNewRelease ? 50 : 0;
        const premiumBonus = booking.show.isPremium ? 25 : 0;
        
        return basePoints + movieReleaseBonus + premiumBonus;
    }

    async addPoints(userId: number, booking: Booking) {
        const userPoints = await this.getUserPoints(userId);
        const pointsToAdd = await this.calculatePoints(booking);

        userPoints.totalPoints += pointsToAdd;
        userPoints.availablePoints += pointsToAdd;
        userPoints.totalBookings += 1;
        userPoints.totalSpent = Number(userPoints.totalSpent) + Number(booking.amountPaid);

        // Update tier based on total spent
        userPoints.tier = this.calculateTier(Number(userPoints.totalSpent));

        await this.userPointsRepository.save(userPoints);
        return pointsToAdd;
    }

    async redeemPoints(userId: number, pointsToRedeem: number): Promise<number> {
        const userPoints = await this.getUserPoints(userId);
        
        if (userPoints.availablePoints >= pointsToRedeem) {
            userPoints.availablePoints -= pointsToRedeem;
            await this.userPointsRepository.save(userPoints);
            
            // Convert points to discount (1 point = $0.01)
            return pointsToRedeem * 0.01;
        }
        
        throw new Error('Insufficient points');
    }

    private calculateTier(totalSpent: number): LoyaltyTier {
        if (totalSpent >= 1000) return LoyaltyTier.PLATINUM;
        if (totalSpent >= 500) return LoyaltyTier.GOLD;
        if (totalSpent >= 200) return LoyaltyTier.SILVER;
        return LoyaltyTier.BRONZE;
    }

    async getTierBenefits(tier: LoyaltyTier) {
        const benefits = {
            [LoyaltyTier.BRONZE]: {
                pointsMultiplier: 1,
                earlyBooking: false,
                freeUpgrades: 0,
                birthdayBonus: 100
            },
            [LoyaltyTier.SILVER]: {
                pointsMultiplier: 1.2,
                earlyBooking: true,
                freeUpgrades: 1,
                birthdayBonus: 200
            },
            [LoyaltyTier.GOLD]: {
                pointsMultiplier: 1.5,
                earlyBooking: true,
                freeUpgrades: 2,
                birthdayBonus: 300
            },
            [LoyaltyTier.PLATINUM]: {
                pointsMultiplier: 2,
                earlyBooking: true,
                freeUpgrades: 5,
                birthdayBonus: 500
            }
        };

        return benefits[tier];
    }
}