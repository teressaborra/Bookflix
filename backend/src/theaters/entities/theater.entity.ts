import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Show } from '../../shows/entities/show.entity';

@Entity()
export class Theater {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    location: string;

    @Column({ default: true })
    wheelchairAccessible: boolean;

    @Column({ default: false })
    hearingLoopAvailable: boolean;

    @Column({ default: false })
    hasElevator: boolean;

    @Column({ default: 0 })
    wheelchairSeats: number;

    @Column('simple-json', { nullable: true })
    amenities: string[];

    @Column({ nullable: true })
    parkingInfo: string;

    @Column({ nullable: true })
    contactNumber: string;

    @OneToMany(() => Show, (show) => show.theater)
    shows: Show[];
}
