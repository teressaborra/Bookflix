import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum LoyaltyTier {
    BRONZE = 'Bronze',
    SILVER = 'Silver',
    GOLD = 'Gold',
    PLATINUM = 'Platinum'
}

@Entity()
export class UserPoints {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column({ default: 0 })
    totalPoints: number;

    @Column({ default: 0 })
    availablePoints: number;

    @Column({ type: 'enum', enum: LoyaltyTier, default: LoyaltyTier.BRONZE })
    tier: LoyaltyTier;

    @Column({ default: 0 })
    totalBookings: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalSpent: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}