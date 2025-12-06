import React, { useState, useEffect } from 'react';
import { seatApi } from '../api/services';
import type { SeatRecommendation, SeatMap } from '../types';
import { Sparkles, Users, Eye } from 'lucide-react';

interface SeatSelectionProps {
    showId: number;
    onSeatsSelected: (seats: number[]) => void;
    maxSeats?: number;
}

const SeatSelection: React.FC<SeatSelectionProps> = ({
    showId,
    onSeatsSelected,
    maxSeats = 8
}) => {
    const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
    const [recommendations, setRecommendations] = useState<SeatRecommendation[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [groupSize, setGroupSize] = useState(1);
    const [loading, setLoading] = useState(true);
    const [showRecommendations, setShowRecommendations] = useState(false);

    useEffect(() => {
        loadSeatData();
    }, [showId]);

    useEffect(() => {
        if (groupSize > 1) {
            loadRecommendations();
        }
    }, [groupSize]);

    const loadSeatData = async () => {
        try {
            const [seatMapRes, recommendationsRes] = await Promise.all([
                seatApi.getSeatMap(showId),
                seatApi.getRecommendations(showId, 1)
            ]);
            setSeatMap(seatMapRes.data);
            setRecommendations(recommendationsRes.data);
        } catch (error) {
            console.error('Error loading seat data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadRecommendations = async () => {
        try {
            const response = await seatApi.getRecommendations(showId, groupSize);
            setRecommendations(response.data);
        } catch (error) {
            console.error('Error loading recommendations:', error);
        }
    };

    const handleSeatClick = (seatNumber: number, isOccupied: boolean) => {
        if (isOccupied) return;

        const newSelectedSeats = selectedSeats.includes(seatNumber)
            ? selectedSeats.filter(s => s !== seatNumber)
            : selectedSeats.length < maxSeats
                ? [...selectedSeats, seatNumber]
                : selectedSeats;

        setSelectedSeats(newSelectedSeats);
        onSeatsSelected(newSelectedSeats);
    };

    const applyRecommendation = (recommendation: SeatRecommendation) => {
        if (groupSize === 1) {
            const newSeats = [recommendation.seatNumber];
            setSelectedSeats(newSeats);
            onSeatsSelected(newSeats);
        } else {
            // For group bookings, select consecutive seats starting from recommendation
            const consecutiveSeats = [];
            for (let i = 0; i < groupSize; i++) {
                consecutiveSeats.push(recommendation.seatNumber + i);
            }
            setSelectedSeats(consecutiveSeats);
            onSeatsSelected(consecutiveSeats);
        }
        setShowRecommendations(false);
    };

    const getSeatColor = (seat: any) => {
        if (seat.isOccupied) return 'bg-gray-600 cursor-not-allowed';
        if (selectedSeats.includes(seat.seatNumber)) return 'bg-primary hover:bg-red-700';
        if (recommendations.some(r => r.seatNumber === seat.seatNumber)) return 'bg-yellow-500 hover:bg-yellow-600';
        return 'bg-gray-400 hover:bg-gray-300';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!seatMap) {
        return <div className="text-center text-red-500">Error loading seat map</div>;
    }

    return (
        <div className="bg-card rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-xl font-heading mb-4">Select Your Seats</h3>

                {/* Group Size Selector */}
                <div className="flex items-center gap-4 mb-4">
                    <label className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Group Size:</span>
                    </label>
                    <select
                        value={groupSize}
                        onChange={(e) => setGroupSize(Number(e.target.value))}
                        className="bg-dark border border-white/20 rounded px-3 py-1"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowRecommendations(!showRecommendations)}
                        className="btn-outline flex items-center gap-2 text-sm"
                    >
                        <Sparkles className="w-4 h-4" />
                        Smart Suggestions
                    </button>
                </div>

                {/* Recommendations Panel */}
                {showRecommendations && recommendations.length > 0 && (
                    <div className="bg-dark/50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            Recommended Seats
                        </h4>
                        <div className="grid gap-2">
                            {recommendations.slice(0, 3).map((rec) => (
                                <button
                                    key={rec.seatNumber}
                                    onClick={() => applyRecommendation(rec)}
                                    className="flex items-center justify-between p-3 bg-card hover:bg-white/5 rounded border border-white/10 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center text-dark font-bold text-sm">
                                            {rec.seatNumber}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium">Seat {rec.seatNumber}</div>
                                            <div className="text-sm text-muted">{rec.reason}</div>
                                        </div>
                                    </div>
                                    <div className="text-yellow-500 font-bold">
                                        {rec.score}/100
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Screen */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 h-3 rounded-full mb-2"></div>
                <div className="text-center text-sm text-muted flex items-center justify-center gap-2">
                    <Eye className="w-4 h-4" />
                    SCREEN
                </div>
            </div>

            {/* Seat Map */}
            <div className="flex flex-col items-center gap-2 mb-6">
                {seatMap.seatMap.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((seat) => (
                            <button
                                key={seat.seatNumber}
                                onClick={() => handleSeatClick(seat.seatNumber, seat.isOccupied)}
                                className={`w-8 h-8 rounded-t-lg text-xs font-bold transition-colors ${getSeatColor(seat)}`}
                                disabled={seat.isOccupied}
                                title={`Seat ${seat.seatNumber} - Row ${seat.row}`}
                            >
                                {seat.seatInRow}
                            </button>
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-400 rounded-t"></div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-primary rounded-t"></div>
                    <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-t"></div>
                    <span>Recommended</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-600 rounded-t"></div>
                    <span>Occupied</span>
                </div>
            </div>

            {/* Selected Seats Summary */}
            {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold">Selected Seats: {selectedSeats.join(', ')}</div>
                            <div className="text-sm text-muted">{selectedSeats.length} seat(s) selected</div>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedSeats([]);
                                onSeatsSelected([]);
                            }}
                            className="text-primary hover:text-red-400 text-sm"
                        >
                            Clear Selection
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SeatSelection;