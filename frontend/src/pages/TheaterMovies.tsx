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
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });

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
                {/* Enhanced Date Selection */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                                Select Show Date
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Choose a date to view available showtimes
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm font-medium text-gray-800">
                                {new Date(selectedDate).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <div className="text-xs text-gray-500">Selected Date</div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-3">
                        {getNextSevenDays().map((date, index) => {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const dateString = `${year}-${month}-${day}`;
                            const isSelected = selectedDate === dateString;
                            const isToday = index === 0;
                            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => {
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        setSelectedDate(`${year}-${month}-${day}`);
                                    }}
                                    className={`relative p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                                        isSelected
                                            ? 'bg-gradient-to-br from-red-600 to-red-700 text-white shadow-lg'
                                            : isWeekend
                                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                                    }`}
                                >
                                    {isToday && (
                                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            Today
                                        </div>
                                    )}
                                    
                                    <div className={`text-xs font-medium mb-1 ${
                                        isSelected ? 'text-red-100' : isWeekend ? 'text-blue-600' : 'text-gray-500'
                                    }`}>
                                        {date.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                    
                                    <div className={`text-2xl font-bold mb-1 ${
                                        isSelected ? 'text-white' : isWeekend ? 'text-blue-800' : 'text-gray-800'
                                    }`}>
                                        {date.getDate()}
                                    </div>
                                    
                                    <div className={`text-xs ${
                                        isSelected ? 'text-red-200' : isWeekend ? 'text-blue-500' : 'text-gray-500'
                                    }`}>
                                        {date.toLocaleDateString('en-US', { month: 'short' })}
                                    </div>
                                    
                                    {isWeekend && !isSelected && (
                                        <div className="text-xs text-blue-600 font-medium mt-1">
                                            Weekend
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    
                    {/* Quick Date Actions */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    const today = new Date();
                                    const year = today.getFullYear();
                                    const month = String(today.getMonth() + 1).padStart(2, '0');
                                    const day = String(today.getDate()).padStart(2, '0');
                                    setSelectedDate(`${year}-${month}-${day}`);
                                }}
                                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={() => {
                                    const tomorrow = new Date();
                                    tomorrow.setDate(tomorrow.getDate() + 1);
                                    const year = tomorrow.getFullYear();
                                    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
                                    const day = String(tomorrow.getDate()).padStart(2, '0');
                                    setSelectedDate(`${year}-${month}-${day}`);
                                }}
                                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                Tomorrow
                            </button>
                            <button
                                onClick={() => {
                                    const nextWeekend = new Date();
                                    const daysUntilSaturday = (6 - nextWeekend.getDay()) % 7;
                                    nextWeekend.setDate(nextWeekend.getDate() + (daysUntilSaturday || 7));
                                    const year = nextWeekend.getFullYear();
                                    const month = String(nextWeekend.getMonth() + 1).padStart(2, '0');
                                    const day = String(nextWeekend.getDate()).padStart(2, '0');
                                    setSelectedDate(`${year}-${month}-${day}`);
                                }}
                                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                            >
                                Weekend
                            </button>
                        </div>
                        
                        <div className="text-xs text-gray-500">
                            Showing next 7 days
                        </div>
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