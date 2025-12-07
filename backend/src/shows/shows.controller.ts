import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { CreateShowDto } from './dto/create-show.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('shows')
export class ShowsController {
    constructor(private readonly showsService: ShowsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createShowDto: CreateShowDto) {
        return this.showsService.create(createShowDto);
    }

    @Get()
    findAll(
        @Query('movieId') movieId?: string, 
        @Query('date') date?: string,
        @Query('theaterId') theaterId?: string
    ) {
        return this.showsService.findAll(
            movieId ? +movieId : undefined, 
            date,
            theaterId ? +theaterId : undefined
        );
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.showsService.findOne(+id);
    }

    @Get(':id/seats')
    getSeats(@Param('id') id: string) {
        return this.showsService.getSeats(+id);
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    update(@Param('id') id: string, @Body() updateShowDto: CreateShowDto) {
        return this.showsService.update(+id, updateShowDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    remove(@Param('id') id: string) {
        return this.showsService.remove(+id);
    }
}
