import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('theaters')
export class TheatersController {
    constructor(private readonly theatersService: TheatersService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    create(@Body() createTheaterDto: CreateTheaterDto) {
        return this.theatersService.create(createTheaterDto);
    }

    @Get()
    findAll() {
        return this.theatersService.findAll();
    }
}
