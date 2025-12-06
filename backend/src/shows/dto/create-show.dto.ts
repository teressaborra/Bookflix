import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreateShowDto {
    @IsNotEmpty()
    @IsNumber()
    movieId: number;

    @IsNotEmpty()
    @IsNumber()
    theaterId: number;

    @IsNotEmpty()
    @IsDateString()
    startTime: string;

    @IsNotEmpty()
    @IsNumber()
    totalSeats: number;

    @IsNotEmpty()
    @IsNumber()
    basePrice: number;

    @IsOptional()
    @IsNumber()
    currentPrice?: number;

    @IsOptional()
    @IsBoolean()
    isPremium?: boolean;

    @IsOptional()
    @IsBoolean()
    isSpecialScreening?: boolean;
}
