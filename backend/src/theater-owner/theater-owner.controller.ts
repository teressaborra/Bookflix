import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TheaterOwnerGuard } from '../auth/guards/theater-owner.guard';
import { TheatersService } from '../theaters/theaters.service';
import { ShowsService } from '../shows/shows.service';
import { CreateShowDto } from '../shows/dto/create-show.dto';

@Controller('theater-owner')
@UseGuards(JwtAuthGuard, TheaterOwnerGuard)
export class TheaterOwnerController {
  constructor(
    private readonly theatersService: TheatersService,
    private readonly showsService: ShowsService,
  ) {}

  @Get('my-theater')
  async getMyTheater(@Request() req) {
    const user = req.user;

    if (user.role === 'admin') {
      return { message: 'Admins can manage all theaters' };
    }

    if (!user.theaterId) {
      return { message: 'No theater assigned' };
    }

    const theaters = await this.theatersService.findAll();
    const theater = theaters.find((t) => t.id === user.theaterId);
    return theater;
  }

  @Get('my-shows')
  async getMyTheaterShows(@Request() req) {
    const user = req.user;

    if (!user.theaterId) {
      return [];
    }

    return await this.showsService.findAll(
      undefined,
      undefined,
      user.theaterId,
    );
  }

  @Post('add-show')
  async addShow(@Request() req, @Body() createShowDto: CreateShowDto) {
    const user = req.user;

    // Ensure theater owner can only add shows to their theater
    if (
      user.role === 'theater_owner' &&
      createShowDto.theaterId !== user.theaterId
    ) {
      throw new BadRequestException(
        'You can only add shows to your own theater',
      );
    }

    return await this.showsService.create(createShowDto);
  }
}
