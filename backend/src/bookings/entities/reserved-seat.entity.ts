import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Show } from '../../shows/entities/show.entity';
import { Booking } from './booking.entity';

@Entity()
@Unique(['show', 'seatNo'])
export class ReservedSeat {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Show, (show) => show.reservedSeats, { onDelete: 'CASCADE' })
    show: Show;

    @Column()
    seatNo: number;

    @ManyToOne(() => Booking, (booking) => booking.reservedSeats, { onDelete: 'CASCADE' })
    booking: Booking;
}
