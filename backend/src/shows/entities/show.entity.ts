import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Theater } from '../../theaters/entities/theater.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { ReservedSeat } from '../../bookings/entities/reserved-seat.entity';

@Entity()
export class Show {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Movie, (movie) => movie.shows, { onDelete: 'CASCADE' })
    movie: Movie;

    @ManyToOne(() => Theater, (theater) => theater.shows, { onDelete: 'CASCADE' })
    theater: Theater;

    @Column()
    startTime: Date;

    @Column()
    totalSeats: number;

    @Column('decimal', { precision: 10, scale: 2 })
    basePrice: number;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 1.0 })
    priceMultiplier: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    currentPrice: number;

    @Column({ default: 0 })
    bookedSeats: number;

    @Column({ default: false })
    isPremium: boolean;

    @Column({ default: false })
    isSpecialScreening: boolean;

    @OneToMany(() => Booking, (booking) => booking.show)
    bookings: Booking[];

    @OneToMany(() => ReservedSeat, (reservedSeat) => reservedSeat.show)
    reservedSeats: ReservedSeat[];
}
