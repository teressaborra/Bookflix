import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    durationMin: number;

    @IsNotEmpty()
    @IsString()
    language: string;

    @IsNotEmpty()
    @IsString()
    posterUrl: string;
}
