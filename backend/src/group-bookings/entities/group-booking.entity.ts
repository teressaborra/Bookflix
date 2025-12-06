import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Show } from '../../shows/entities/show.entity';

export enum GroupBookingStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    CANCELLED = 'cancelled'
}

@Entity()
export class GroupBooking {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    organizer: User;

    @ManyToMany(() => User, { eager: true })
    @JoinTable()
    invitedUsers: User[];

    @ManyToOne(() => Show, { eager: true })
    show: Show;

    @Column({ type: 'enum', enum: GroupBookingStatus, default: GroupBookingStatus.PENDING })
    status: GroupBookingStatus;

    @Column()
    maxParticipants: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    discountPercentage: number;

    @Column('text', { nullable: true })
    message: string;

    @CreateDateColumn()
    createdAt: Date;
}