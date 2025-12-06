import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
    @IsNotEmpty()
    @IsNumber()
    showId: number;

    @IsNotEmpty()
    @IsArray()
    seats: number[];

    @IsOptional()
    @IsNumber()
    pointsToRedeem?: number;

    @IsOptional()
    @IsString()
    paymentMethod?: string;
}
