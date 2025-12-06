import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { moviesApi, showsApi } from '../api/services-simple';
import { Clock, Calendar, MapPin, Star, ArrowLeft } from 'lucide-react';

interface Theater {
    id: number;
    name: string;
    location: string;
    wheelchairAccessible: boolean;
    hearingLoopAvailable: boolean;
    hasElevator: boolean;
    wheelchairSeats: number;
    amenities: string[];
    parkingInfo: string;
    contactNumber: string;
}

interface Movie {
    id: number;
    title: string;
    description: string;
    durationMin: number;
    language: string;
    posterUrl: string;
    genre: string;
    rating: string;
    releaseDate: string;
    director: string;
    cast: string[];
    isNewRelease: boolean;
}

interface Show {
    id: number;
    startTime: string;
    totalSeats: number;
    basePrice: number;
    currentPrice: number;
    bookedSeats: number;
    isPremium: boolean;
    isSpecialScreening: boolean;
    movie: Movie;
    theater: Theater;
}

const MovieTheaters: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (movieId) {
            fetchMovieAndShows();
        }
    }, [movieId, selectedDate]);

    const fetchMovieAndShows = async () => {
        try {
            setLoading(true);
            
            // Fetch movie details
            const movieResponse = await moviesApi.getById(Number(movieId));
            setMovie(movieResponse.data);

            // Fetch shows for this movie
            const showsResponse = await showsApi.getByMovie(Number(movieId), selectedDate);
            setShows(showsResponse.data || []);
        } catch (error) {
            console.error('Error fetching movie data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Group shows by theater
    const theaterGroups = shows.reduce((groups: { [key: number]: Show[] }, show) => {
        const theaterId = show.theater.id;
        if (!groups[theaterId]) {
            groups[theaterId] = [];
        }
        groups[theaterId].push(show);
        return groups;
    }, {});

    const getNextSevenDays = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading movie theaters...</p>
                </div>
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Movie Not Found</h2>
                    <Link to="/" className="text-red-600 hover:text-red-700">
                        ← Back to Movies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-red-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Movies
                    </Link>
                    
                    <div className="md:flex items-start gap-6">
                        <img
                            src={movie.posterUrl || '/api/placeholder/200/300'}
                            alt={movie.title}
                            className="w-32 h-48 object-cover rounded-lg mb-4 md:mb-0"
                        />
                        
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{movie.title}</h1>
                            <div className="flex items-center gap-4 text-red-100 mb-4">
                                <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {movie.durationMin} min
                                </span>
                                <span>{movie.genre}</span>
                                <span>{movie.language}</span>
                                <span className="px-2 py-1 bg-red-500/20 rounded text-xs font-medium">
                                    {movie.rating}
                                </span>
                            </div>
                            <p className="text-red-100 mb-4 max-w-2xl">{movie.description}</p>
                            
                            {movie.director && (
                                <p className="text-red-200 text-sm">
                                    <span className="font-medium">Director:</span> {movie.director}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Date Selection */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Date</h3>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {getNextSevenDays().map((date, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                                className={`flex-shrink-0 px-4 py-3 rounded-lg text-center min-w-[80px] transition-colors ${
                                    selectedDate === date.toISOString().split('T')[0]
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <div className="text-xs font-medium">
                                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                </div>
                                <div className="text-sm font-bold">
                                    {date.getDate()}
                                </div>
                                <div className="text-xs">
                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Theaters and Showtimes */}
                {Object.keys(theaterGroups).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No shows available</h3>
                        <p className="text-gray-500">
                            This movie is not scheduled for {new Date(selectedDate).toLocaleDateString()} at any theater.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(theaterGroups).map(([theaterId, theaterShows]) => {
                            const theater = theaterShows[0].theater;
                            return (
                                <div key={theaterId} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                {theater.name}
                                            </h3>
                                            <p className="text-gray-600 flex items-center mb-2">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {theater.location}
                                            </p>
                                            
                                            {/* Theater amenities */}
                                            <div className="flex flex-wrap gap-1">
                                                {theater.wheelchairAccessible && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                                                        Wheelchair Accessible
                                                    </span>
                                                )}
                                                {theater.amenities.slice(0, 2).map((amenity, index) => (
                                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                        {amenity}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <Link
                                            to={`/theaters/${theater.id}/movies`}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                                        >
                                            View All Movies →
                                        </Link>
                                    </div>
                                    
                                    {/* Showtimes */}
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Showtimes</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {theaterShows
                                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                                .map((show) => (
                                                <Link
                                                    key={show.id}
                                                    to={`/booking/${show.id}`}
                                                    className="block p-3 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                                                >
                                                    <div className="text-center">
                                                        <div className="font-bold text-gray-800">
                                                            {new Date(show.startTime).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                hour12: true
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-600 mt-1">
                                                            ₹{show.currentPrice || show.basePrice}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {show.totalSeats - show.bookedSeats} seats left
                                                        </div>
                                                        {show.isPremium && (
                                                            <div className="text-xs text-yellow-600 font-medium mt-1">
                                                                Premium
                                                            </div>
                                                        )}
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieTheaters;