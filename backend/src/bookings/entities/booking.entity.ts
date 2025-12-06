import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Show } from '../../shows/entities/show.entity';
import { ReservedSeat } from './reserved-seat.entity';

export enum BookingStatus {
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    RESCHEDULED = 'RESCHEDULED',
    REFUNDED = 'REFUNDED'
}

@Entity()
export class Booking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.bookings)
    user: User;

    @ManyToOne(() => Show, (show) => show.bookings)
    show: Show;

    @Column('simple-array')
    seats: number[];

    @Column('decimal', { precision: 10, scale: 2 })
    amountPaid: number;

    @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.CONFIRMED })
    status: BookingStatus;

    @Column({ nullable: true })
    cancellationReason: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    refundPercentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    refundAmount: number;

    @Column({ nullable: true })
    originalBookingId: number;

    @Column({ default: 0 })
    pointsEarned: number;

    @Column({ default: 0 })
    pointsUsed: number;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    transactionId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ReservedSeat, (reservedSeat) => reservedSeat.booking)
    reservedSeats: ReservedSeat[];
}
