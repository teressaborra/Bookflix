import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theatersApi, showsApi } from '../api/services-simple';
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

const TheaterMovies: React.FC = () => {
    const { theaterId } = useParams<{ theaterId: string }>();
    const [theater, setTheater] = useState<Theater | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (theaterId) {
            fetchTheaterAndShows();
        }
    }, [theaterId, selectedDate]);

    const fetchTheaterAndShows = async () => {
        try {
            setLoading(true);
            // Fetch theater details
            const theaterResponse = await theatersApi.getAll();
            const theaterData = theaterResponse.data.find((t: Theater) => t.id === Number(theaterId));
            setTheater(theaterData || null);

            // Fetch shows for this theater
            const showsResponse = await showsApi.getByTheater(Number(theaterId), selectedDate);
            setShows(showsResponse.data || []);
        } catch (error) {
            console.error('Error fetching theater data:', error);
            // Set some dummy data for testing if API fails
            if (!theater) {
                setTheater({
                    id: Number(theaterId),
                    name: "Sample Theater",
                    location: "Sample Location",
                    wheelchairAccessible: true,
                    hearingLoopAvailable: false,
                    hasElevator: true,
                    wheelchairSeats: 4,
                    amenities: ["Parking", "Food Court"],
                    parkingInfo: "Free parking available",
                    contactNumber: "+91 9876543210"
                });
            }
        } finally {
            setLoading(false);
        }
    };

    // Group shows by movie
    const movieGroups = shows.reduce((groups: { [key: number]: Show[] }, show) => {
        const movieId = show.movie.id;
        if (!groups[movieId]) {
            groups[movieId] = [];
        }
        groups[movieId].push(show);
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
                    <p className="mt-4 text-gray-600">Loading theater movies...</p>
                </div>
            </div>
        );
    }

    if (!theater) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Theater Not Found</h2>
                    <Link to="/theaters" className="text-red-600 hover:text-red-700">
                        ← Back to Theaters
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
                        to="/theaters" 
                        className="inline-flex items-center text-red-100 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Theaters
                    </Link>
                    
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-2">{theater.name}</h1>
                            <p className="text-red-100 flex items-center mb-4">
                                <MapPin className="w-4 h-4 mr-2" />
                                {theater.location}
                            </p>
                            
                            {/* Theater amenities */}
                            <div className="flex flex-wrap gap-2">
                                {theater.wheelchairAccessible && (
                                    <span className="px-2 py-1 bg-red-500/20 rounded-full text-xs">
                                        Wheelchair Accessible
                                    </span>
                                )}
                                {theater.amenities && theater.amenities.slice(0, 3).map((amenity, index) => (
                                    <span key={index} className="px-2 py-1 bg-red-500/20 rounded-full text-xs">
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        {theater.contactNumber && (
                            <div className="text-right">
                                <p className="text-sm text-red-100">Contact</p>
                                <p className="font-semibold">{theater.contactNumber}</p>
                            </div>
                        )}
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



                {/* Movies and Showtimes */}
                {Object.keys(movieGroups).length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎬</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No shows available</h3>
                        <p className="text-gray-500 mb-4">
                            No movies are scheduled for {new Date(selectedDate).toLocaleDateString()} at this theater.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> If you're an admin, please create shows for this theater using the Admin Panel.
                            </p>
                        </div>
                        <Link 
                            to="/admin" 
                            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Admin Panel →
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(movieGroups).map(([movieId, movieShows]) => {
                            const movie = movieShows[0].movie;
                            return (
                                <div key={movieId} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="md:flex">
                                        {/* Movie Poster */}
                                        <div className="md:w-48 flex-shrink-0">
                                            <img
                                                src={movie.posterUrl || '/api/placeholder/300/450'}
                                                alt={movie.title}
                                                className="w-full h-64 md:h-full object-cover"
                                            />
                                        </div>
                                        
                                        {/* Movie Details */}
                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                                        {movie.title}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                        <span className="flex items-center">
                                                            <Clock className="w-4 h-4 mr-1" />
                                                            {movie.durationMin} min
                                                        </span>
                                                        <span>{movie.genre}</span>
                                                        <span>{movie.language}</span>
                                                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                                                            {movie.rating}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                                                        {movie.description}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            {/* Showtimes */}
                                            <div>
                                                <h4 className="font-semibold text-gray-800 mb-3">Showtimes</h4>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                                    {movieShows
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

export default TheaterMovies;