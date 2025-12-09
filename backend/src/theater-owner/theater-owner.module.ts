import { Module } from '@nestjs/common';
import { TheaterOwnerController } from './theater-owner.controller';
import { TheatersModule } from '../theaters/theaters.module';
import { ShowsModule } from '../shows/shows.module';

@Module({
    imports: [TheatersModule, ShowsModule],
    controllers: [TheaterOwnerController],
})
export class TheaterOwnerModule {}
