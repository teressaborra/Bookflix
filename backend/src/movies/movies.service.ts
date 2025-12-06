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
}
