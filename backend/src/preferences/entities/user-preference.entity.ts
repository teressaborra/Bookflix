import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class UserPreference {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Column('simple-array', { nullable: true })
    favoriteGenres: string[];

    @Column('simple-array', { nullable: true })
    favoriteActors: string[];

    @Column('simple-array', { nullable: true })
    favoriteDirectors: string[];

    @Column({ default: true })
    notifyNewReleases: boolean;

    @Column({ default: true })
    notifyPriceDrops: boolean;

    @Column({ default: true })
    notifyGroupInvites: boolean;

    @Column('simple-array', { nullable: true })
    preferredShowTimes: string[];

    @Column('simple-array', { nullable: true })
    preferredTheaters: string[];

    @Column({ default: false })
    requireSubtitles: boolean;

    @Column({ default: false })
    requireAudioDescription: boolean;
}