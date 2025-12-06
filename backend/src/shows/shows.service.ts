import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from './entities/show.entity';
import { CreateShowDto } from './dto/create-show.dto';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from '../theaters/entities/theater.entity';

@Injectable()
export class ShowsService {
    constructor(
        @InjectRepository(Show)
        private showsRepository: Repository<Show>,
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
        @InjectRepository(Theater)
        private theatersRepository: Repository<Theater>,
    ) { }

    async create(createShowDto: CreateShowDto) {
        const movie = await this.moviesRepository.findOne({ where: { id: createShowDto.movieId } });
        const theater = await this.theatersRepository.findOne({ where: { id: createShowDto.theaterId } });

        if (!movie || !theater) {
            throw new NotFoundException('Movie or Theater not found');
        }

        const show = this.showsRepository.create({
            movie,
            theater,
            startTime: new Date(createShowDto.startTime),
            totalSeats: createShowDto.totalSeats,
            basePrice: createShowDto.basePrice,
            currentPrice: createShowDto.currentPrice || createShowDto.basePrice,
            isPremium: createShowDto.isPremium || false,
            isSpecialScreening: createShowDto.isSpecialScreening || false,
        });
        return this.showsRepository.save(show);
    }

    findAll(movieId?: number, date?: string, theaterId?: number) {
        const query = this.showsRepository.createQueryBuilder('show')
            .leftJoinAndSelect('show.movie', 'movie')
            .leftJoinAndSelect('show.theater', 'theater')
            .orderBy('show.startTime', 'ASC');

        if (movieId) {
            query.andWhere('show.movie.id = :movieId', { movieId });
        }

        if (theaterId) {
            query.andWhere('show.theater.id = :theaterId', { theaterId });
        }

        if (date) {
            // Filter by date (shows on the specified date)
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            
            query.andWhere('show.startTime >= :startOfDay', { startOfDay });
            query.andWhere('show.startTime <= :endOfDay', { endOfDay });
        } else {
            // Default: only show future shows
            query.andWhere('show.startTime > :now', { now: new Date() });
        }

        return query.getMany();
    }

    async findOne(id: number) {
        return this.showsRepository.findOne({
            where: { id },
            relations: ['movie', 'theater']
        });
    }

    async getSeats(id: number) {
        const show = await this.showsRepository.findOne({
            where: { id },
            relations: ['reservedSeats']
        });
        if (!show) throw new NotFoundException('Show not found');

        return {
            showId: show.id,
            totalSeats: show.totalSeats,
            reservedSeats: show.reservedSeats.map(rs => rs.seatNo)
        };
    }
}
