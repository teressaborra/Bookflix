import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Show } from '../shows/entities/show.entity';
import { ReservedSeat } from '../bookings/entities/reserved-seat.entity';

export interface SeatRecommendation {
    seatNumber: number;
    score: number;
    reason: string;
}

@Injectable()
export class SeatRecommendationsService {
    constructor(
        @InjectRepository(Show)
        private showsRepository: Repository<Show>,
        @InjectRepository(ReservedSeat)
        private reservedSeatsRepository: Repository<ReservedSeat>,
    ) {}

    async getRecommendedSeats(showId: number, groupSize: number): Promise<SeatRecommendation[]> {
        const show = await this.showsRepository.findOne({ where: { id: showId } });
        if (!show) throw new Error('Show not found');

        const reservedSeats = await this.reservedSeatsRepository.find({
            where: { show: { id: showId } }
        });

        const occupiedSeatNumbers = new Set(reservedSeats.map(seat => seat.seatNo));
        const availableSeats = this.getAvailableSeats(show.totalSeats, occupiedSeatNumbers);

        if (groupSize === 1) {
            return this.getSingleSeatRecommendations(availableSeats, show.totalSeats);
        } else {
            return this.getGroupSeatRecommendations(availableSeats, groupSize, show.totalSeats);
        }
    }

    private getAvailableSeats(totalSeats: number, occupiedSeats: Set<number>): number[] {
        const available: number[] = [];
        for (let i = 1; i <= totalSeats; i++) {
            if (!occupiedSeats.has(i)) {
                available.push(i);
            }
        }
        return available;
    }

    private getSingleSeatRecommendations(availableSeats: number[], totalSeats: number): SeatRecommendation[] {
        const recommendations: SeatRecommendation[] = [];
        const seatsPerRow = Math.ceil(Math.sqrt(totalSeats)); // Assuming square-ish layout
        const totalRows = Math.ceil(totalSeats / seatsPerRow);

        availableSeats.forEach(seatNumber => {
            const row = Math.ceil(seatNumber / seatsPerRow);
            const seatInRow = ((seatNumber - 1) % seatsPerRow) + 1;
            
            let score = 100;
            let reason = 'Available seat';

            // Prefer middle rows (not too close, not too far)
            const idealRow = Math.ceil(totalRows * 0.4); // 40% back from screen
            const rowDistance = Math.abs(row - idealRow);
            score -= rowDistance * 5;

            // Prefer center seats
            const centerSeat = Math.ceil(seatsPerRow / 2);
            const seatDistance = Math.abs(seatInRow - centerSeat);
            score -= seatDistance * 3;

            // Bonus for optimal viewing distance
            if (row >= Math.ceil(totalRows * 0.3) && row <= Math.ceil(totalRows * 0.7)) {
                score += 20;
                reason = 'Optimal viewing distance';
            }

            // Bonus for center seats
            if (seatDistance <= 2) {
                score += 15;
                reason = 'Center seating area';
            }

            recommendations.push({ seatNumber, score, reason });
        });

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    private getGroupSeatRecommendations(availableSeats: number[], groupSize: number, totalSeats: number): SeatRecommendation[] {
        const recommendations: SeatRecommendation[] = [];
        const seatsPerRow = Math.ceil(Math.sqrt(totalSeats));
        
        // Find consecutive available seats
        for (let i = 0; i <= availableSeats.length - groupSize; i++) {
            const consecutiveSeats: number[] = [];
            let currentSeat = availableSeats[i];
            
            for (let j = 0; j < groupSize; j++) {
                if (availableSeats.includes(currentSeat + j)) {
                    consecutiveSeats.push(currentSeat + j);
                } else {
                    break;
                }
            }

            if (consecutiveSeats.length === groupSize) {
                // Check if seats are in the same row
                const firstRow = Math.ceil(consecutiveSeats[0] / seatsPerRow);
                const lastRow = Math.ceil(consecutiveSeats[consecutiveSeats.length - 1] / seatsPerRow);
                
                if (firstRow === lastRow) {
                    let score = 100;
                    const row = firstRow;
                    const totalRows = Math.ceil(totalSeats / seatsPerRow);
                    
                    // Prefer middle rows
                    const idealRow = Math.ceil(totalRows * 0.4);
                    const rowDistance = Math.abs(row - idealRow);
                    score -= rowDistance * 5;

                    // Prefer center positioning for the group
                    const groupCenter = (consecutiveSeats[0] + consecutiveSeats[consecutiveSeats.length - 1]) / 2;
                    const rowCenter = (row - 1) * seatsPerRow + seatsPerRow / 2;
                    const centerDistance = Math.abs(groupCenter - rowCenter);
                    score -= centerDistance * 2;

                    // Bonus for keeping group together
                    score += 30;

                    recommendations.push({
                        seatNumber: consecutiveSeats[0], // Return first seat of the group
                        score,
                        reason: `${groupSize} consecutive seats together`
                    });
                }
            }
        }

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
    }

    async getSeatMap(showId: number) {
        const show = await this.showsRepository.findOne({ where: { id: showId } });
        if (!show) throw new Error('Show not found');

        const reservedSeats = await this.reservedSeatsRepository.find({
            where: { show: { id: showId } }
        });

        const seatsPerRow = Math.ceil(Math.sqrt(show.totalSeats));
        const totalRows = Math.ceil(show.totalSeats / seatsPerRow);
        const occupiedSeatNumbers = new Set(reservedSeats.map(seat => seat.seatNo));

        const seatMap: any[] = [];
        for (let row = 1; row <= totalRows; row++) {
            const rowSeats: any[] = [];
            for (let seat = 1; seat <= seatsPerRow; seat++) {
                const seatNumber = (row - 1) * seatsPerRow + seat;
                if (seatNumber <= show.totalSeats) {
                    rowSeats.push({
                        seatNumber,
                        isOccupied: occupiedSeatNumbers.has(seatNumber),
                        row,
                        seatInRow: seat
                    });
                }
            }
            seatMap.push(rowSeats);
        }

        return {
            seatMap,
            totalSeats: show.totalSeats,
            availableSeats: show.totalSeats - reservedSeats.length,
            seatsPerRow,
            totalRows
        };
    }
}