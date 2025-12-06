import api from './axios';
import type { Movie } from '../types';
import type { Booking } from '../types';
import type { MovieReview } from '../types';
import type { UserPoints } from '../types';
import type { SeatRecommendation } from '../types';
import type { SeatMap } from '../types';
import type { PricingInfo } from '../types';
import type { TierBenefits } from '../types';

// Temporary type definitions to avoid import issues
interface AnalyticsData {
    totalRevenue: number;
    totalBookings: number;
    averageBookingValue: number;
    dailyRevenue: Array<{
        date: string;
        revenue: number;
    }>;
    revenueGrowth: number;
}

interface PricingData {
    showId: number;
    movieTitle: string;
    theaterName: string;
    startTime: string;
    basePrice: number;
    currentPrice: number;
    occupancyRate: number;
    availableSeats: number;
}

interface PopularMovie {
    movieId: number;
    title: string;
    bookingCount: number;
    totalRevenue: number;
}

interface PeakHour {
    hour: number;
    bookingCount: number;
}

interface TheaterOccupancy {
    theaterId: number;
    theaterName: string;
    totalShows: number;
    occupancyRate: number;
    totalRevenue: number;
}

interface CustomerInsights {
    newCustomers: number;
    repeatCustomers: number;
    customerRetentionRate: number;
}

// Movie Reviews API
export const reviewsApi = {
    createReview: (movieId: number, rating: number, comment: string) =>
        api.post('/reviews', { movieId, rating, comment }),

    getMovieReviews: (movieId: number) =>
        api.get<MovieReview[]>(`/reviews/movie/${movieId}`),

    getUserReviews: () =>
        api.get<MovieReview[]>('/reviews/user'),

    deleteReview: (reviewId: number) =>
        api.delete(`/reviews/${reviewId}`)
};

// Loyalty System API
export const loyaltyApi = {
    getUserPoints: () =>
        api.get<UserPoints>('/loyalty/points'),

    redeemPoints: (points: number) =>
        api.post('/loyalty/redeem', { points }),

    getTierBenefits: () =>
        api.get<TierBenefits>('/loyalty/benefits')
};

// Recommendations API
export const recommendationsApi = {
    getPersonalized: () =>
        api.get<Movie[]>('/recommendations/personalized'),

    getTrending: () =>
        api.get<Movie[]>('/recommendations/trending'),

    getNewReleases: () =>
        api.get<Movie[]>('/recommendations/new-releases'),

    getSimilar: (movieId: number) =>
        api.get<Movie[]>(`/recommendations/similar/${movieId}`)
};

// Seat Recommendations API
export const seatApi = {
    getRecommendations: (showId: number, groupSize: number = 1) =>
        api.get<SeatRecommendation[]>(`/seat-recommendations/${showId}?groupSize=${groupSize}`),

    getSeatMap: (showId: number) =>
        api.get<SeatMap>(`/seat-recommendations/${showId}/seat-map`)
};

// Dynamic Pricing API
export const pricingApi = {
    getShowPricing: (showId: number) =>
        api.get<PricingInfo>(`/pricing/show/${showId}`),

    getAllShowsPricing: () =>
        api.get<PricingData[]>('/pricing/all-shows'),

    updateShowPricing: (showId: number) =>
        api.post(`/pricing/update/${showId}`),

    predictOptimalPrice: (showId: number) =>
        api.get(`/pricing/predict/${showId}`)
};

// Enhanced Bookings API
export const bookingsApi = {
    createBooking: (showId: number, seats: number[], pointsToRedeem?: number, paymentMethod?: string) =>
        api.post('/bookings', { showId, seats, pointsToRedeem, paymentMethod }),

    getBookingDetails: (bookingId: number) =>
        api.get<Booking>(`/bookings/${bookingId}`),

    cancelBooking: (bookingId: number, reason?: string) =>
        api.put(`/bookings/${bookingId}/cancel`, { reason }),

    rescheduleBooking: (bookingId: number, newShowId: number) =>
        api.put(`/bookings/${bookingId}/reschedule`, { newShowId }),

    getUserBookings: () =>
        api.get<Booking[]>('/bookings/my')
};

// Analytics API (Admin only)
export const analyticsApi = {
    getRevenueAnalytics: (startDate: string, endDate: string) =>
        api.get<AnalyticsData>(`/analytics/revenue?startDate=${startDate}&endDate=${endDate}`),

    getPopularMovies: (startDate: string, endDate: string) =>
        api.get<PopularMovie[]>(`/analytics/popular-movies?startDate=${startDate}&endDate=${endDate}`),

    getPeakHours: (startDate: string, endDate: string) =>
        api.get<PeakHour[]>(`/analytics/peak-hours?startDate=${startDate}&endDate=${endDate}`),

    getTheaterOccupancy: (startDate: string, endDate: string) =>
        api.get<TheaterOccupancy[]>(`/analytics/theater-occupancy?startDate=${startDate}&endDate=${endDate}`),

    getCustomerInsights: (startDate: string, endDate: string) =>
        api.get<CustomerInsights>(`/analytics/customer-insights?startDate=${startDate}&endDate=${endDate}`)
};