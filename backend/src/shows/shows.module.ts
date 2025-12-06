import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { Show } from './entities/show.entity';
import { Movie } from '../movies/entities/movie.entity';
import { Theater } from '../theaters/entities/theater.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Show, Movie, Theater])],
    controllers: [ShowsController],
    providers: [ShowsService],
    exports: [ShowsService],
})
export class ShowsModule { }
