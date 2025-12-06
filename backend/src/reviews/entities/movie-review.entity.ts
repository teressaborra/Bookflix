import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
export class MovieReview {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: true })
    user: User;

    @ManyToOne(() => Movie, { eager: true })
    movie: Movie;

    @Column('int')
    rating: number;

    @Column('text')
    comment: string;

    @Column({ default: true })
    isVisible: boolean;

    @CreateDateColumn()
    createdAt: Date;
}