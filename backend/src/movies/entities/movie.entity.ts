import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Show } from '../../shows/entities/show.entity';

@Entity()
export class Movie {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column()
    durationMin: number;

    @Column()
    language: string;

    @Column()
    posterUrl: string;

    @Column()
    genre: string;

    @Column()
    rating: string; // PG, PG-13, R, etc.

    @Column()
    releaseDate: Date;

    @Column('simple-array', { nullable: true })
    subtitleLanguages: string[];

    @Column('simple-array', { nullable: true })
    audioLanguages: string[];

    @Column({ default: false })
    hasAudioDescription: boolean;

    @Column({ default: false })
    hasClosedCaptions: boolean;

    @Column('simple-array', { nullable: true })
    cast: string[];

    @Column({ nullable: true })
    director: string;

    @Column({ type: 'decimal', precision: 3, scale: 1, default: 0 })
    averageRating: number;

    @Column({ default: 0 })
    totalReviews: number;

    @Column({ default: false })
    isNewRelease: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => Show, (show) => show.movie)
    shows: Show[];
}
