import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';

@Injectable()
export class TheatersService {
    constructor(
        @InjectRepository(Theater)
        private theatersRepository: Repository<Theater>,
    ) { }

    create(createTheaterDto: CreateTheaterDto) {
        const theater = this.theatersRepository.create(createTheaterDto);
        return this.theatersRepository.save(theater);
    }

    findAll() {
        return this.theatersRepository.find();
    }
}
