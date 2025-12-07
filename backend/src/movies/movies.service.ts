import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
    constructor(
        @InjectRepository(Movie)
        private moviesRepository: Repository<Movie>,
    ) { }

    create(createMovieDto: CreateMovieDto) {
        const movie = this.moviesRepository.create(createMovieDto);
        return this.moviesRepository.save(movie);
    }

    findAll() {
        return this.moviesRepository.find();
    }

    findOne(id: number) {
        return this.moviesRepository.findOne({ where: { id } });
    }

    async update(id: number, updateMovieDto: CreateMovieDto) {
        await this.moviesRepository.update(id, updateMovieDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        const movie = await this.findOne(id);
        if (movie) {
            await this.moviesRepository.remove(movie);
        }
        return { message: 'Movie deleted successfully', id };
    }
}
