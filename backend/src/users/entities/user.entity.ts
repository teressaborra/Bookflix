import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    THEATER_OWNER = 'theater_owner',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    passwordHash: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    theaterId: number;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Booking, (booking) => booking.user)
    bookings: Booking[];
}
