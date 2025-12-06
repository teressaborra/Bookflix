import api from './axios';

// Basic API services without type imports to avoid module issues
export const moviesApi = {
    getAll: () => api.get('/movies'),
    getById: (id: number) => api.get(`/movies/${id}`)
};

export const showsApi = {
    getByMovie: (movieId: number, date?: string) => {
        const params = date ? `?movieId=${movieId}&date=${date}` : `?movieId=${movieId}`;
        return api.get(`/shows${params}`);
    },
    getByTheater: (theaterId: number, date?: string) => {
        const params = date ? `?theaterId=${theaterId}&date=${date}` : `?theaterId=${theaterId}`;
        return api.get(`/shows${params}`);
    },
    getSeats: (showId: number) => api.get(`/shows/${showId}/seats`)
};

export const bookingsApi = {
    create: (showId: number, seats: number[]) =>
        api.post('/bookings', { showId, seats }),
    
    getUserBookings: () =>
        api.get('/users/me/bookings')
};

export const theatersApi = {
    getAll: () => api.get('/theaters'),
    create: (theaterData: any) => api.post('/theaters', theaterData)
};

export const authApi = {
    login: (email: string, password: string) =>
        api.post('/auth/login', { email, password }),
    
    register: (name: string, email: string, password: string) =>
        api.post('/auth/register', { name, email, password })
};