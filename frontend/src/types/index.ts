export interface User {
    id: number;
    name: string;
    email: string;
    role: 'user' | 'admin';
}

export interface Movie {
    id: number;
    title: string;
    description: string;
    durationMin: number;
    language: string;
    posterUrl: string;
    genre: string;
    rating: string;
    releaseDate: string;
    subtitleLanguages?: string[];
    audioLanguages?: string[];
    hasAudioDescription: boolean;
    hasClosedCaptions: boolean;
    cast?: string[];
    director?: string;
    averageRating: number;
    totalReviews: number;
    isNewRelease: boolean;
    createdAt: string;
}

export interface Theater {
    id: number;
    name: string;
    location: string;
    wheelchairAccessible: boolean;
    hearingLoopAvailable: boolean;
    hasElevator: boolean;
    wheelchairSeats: number;
    amenities?: string[];
    parkingInfo?: string;
    contactNumber?: string;
}

export interface Show {
    id: number;
    movie: Movie;
    theater: Theater;
    startTime: string;
    totalSeats: number;
    basePrice: number;
    currentPrice: number;
    priceMultiplier: number;
    bookedSeats: number;
    isPremium: boolean;
    isSpecialScreening: boolean;
}

export interface Booking {
    id: number;
    show: Show;
    seats: number[];
    amountPaid: number;
    status: 'CONFIRMED' | 'CANCELLED' | 'RESCHEDULED' | 'REFUNDED';
    cancellationReason?: string;
    refundPercentage?: number;
    refundAmount?: number;
    originalBookingId?: number;
    pointsEarned: number;
    pointsUsed: number;
    paymentMethod?: string;
    transactionId?: string;
    createdAt: string;
    updatedAt: string;
    canCancel?: boolean;
    canReschedule?: boolean;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

// New interfaces for advanced features
export interface MovieReview {
    id: number;
    user: User;
    movie: Movie;
    rating: number;
    comment: string;
    isVisible: boolean;
    createdAt: string;
}

export interface UserPoints {
    id: number;
    user: User;
    totalPoints: number;
    availablePoints: number;
    tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    totalBookings: number;
    totalSpent: number;
    createdAt: string;
    updatedAt: string;
}

export interface SeatRecommendation {
    seatNumber: number;
    score: number;
    reason: string;
}

export interface SeatMap {
    seatMap: Array<Array<{
        seatNumber: number;
        isOccupied: boolean;
        row: number;
        seatInRow: number;
    }>>;
    totalSeats: number;
    availableSeats: number;
    seatsPerRow: number;
    totalRows: number;
}

export interface PricingInfo {
    showId: number;
    basePrice: number;
    currentPrice: number;
    priceMultiplier: number;
    occupancyRate: number;
    lastUpdated: string;
}

export interface AnalyticsData {
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
    dailyRevenue: Array<{
        date: string;
        revenue: number;
    }>;
    revenueGrowth: number;
}

export interface TierBenefits {
    pointsMultiplier: number;
    earlyBooking: boolean;
    freeUpgrades: number;
    birthdayBonus: number;
}

// Additional interfaces for enhanced features
export interface PricingData {
    showId: number;
    movieTitle: string;
    theaterName: string;
    startTime: string;
    basePrice: number;
    currentPrice: number;
    occupancyRate: number;
    availableSeats: number;
}

export interface PopularMovie {
    movieId: number;
    title: string;
    bookingCount: number;
    totalRevenue: number;
}

export interface PeakHour {
    hour: number;
    bookingCount: number;
}

export interface TheaterOccupancy {
    theaterId: number;
    theaterName: string;
    totalShows: number;
    occupancyRate: number;
    totalRevenue: number;
}

export interface CustomerInsights {
    newCustomers: number;
    repeatCustomers: number;
    customerRetentionRate: number;
}

export const TYPES_VERSION = '1.0.0';
