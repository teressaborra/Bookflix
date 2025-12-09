import { IsNotEmpty, IsNumber, IsString, IsArray, IsBoolean, IsOptional, IsDateString } from 'class-validator';

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

    @IsNotEmpty()
    @IsString()
    genre: string;

    @IsNotEmpty()
    @IsString()
    rating: string; // PG, PG-13, R, etc.

    @IsNotEmpty()
    @IsDateString()
    releaseDate: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    subtitleLanguages?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    audioLanguages?: string[];

    @IsOptional()
    @IsBoolean()
    hasAudioDescription?: boolean;

    @IsOptional()
    @IsBoolean()
    hasClosedCaptions?: boolean;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    cast?: string[];

    @IsOptional()
    @IsString()
    director?: string;

    @IsOptional()
    @IsBoolean()
    isNewRelease?: boolean;
}
