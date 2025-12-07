import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { moviesApi, showsApi } from '../api/services-simple';
import { Clock, Calendar, MapPin, Star, ArrowLeft, Users, Zap, Crown } from 'lucide-react';

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

const BookShow: React.FC = () => {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);

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
            // Set some dummy data for testing if API fails
            if (!movie) {
                setMovie({
                    id: Number(movieId),
                    title: "Sample Movie",
                    description: "This is a sample movie for testing",
                    durationMin: 120,
                    language: "English",
                    posterUrl: "/api/placeholder/300/450",
                    genre: "Action",
                    rating: "PG-13",
                    releaseDate: new Date().toISOString(),
                    director: "Sample Director",
                    cast: ["Actor 1", "Actor 2"],
                    isNewRelease: true
                });
            }
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

    const handleShowSelect = (show: Show) => {
        setSelectedShow(show);
        // Navigate to booking page with show ID
        navigate(`/booking/${show.id}`);
    };

    const getOccupancyPercentage = (show: Show) => {
        return (show.bookedSeats / show.totalSeats) * 100;
    };

    const getOccupancyColor = (percentage: number) => {
        if (percentage >= 80) return 'text-red-500';
        if (percentage >= 60) return 'text-orange-500';
        if (percentage >= 40) return 'text-yellow-500';
        return 'text-green-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading showtimes...</p>
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

            {/* Compact Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-3 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Movies
                    </Link>
                    
                    <div className="flex items-center gap-4">
                        <img
                            src={movie.posterUrl || '/api/placeholder/80/120'}
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded-lg shadow-md"
                        />
                        
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-1">{movie.title}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
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
                            <p className="text-gray-600 text-sm">Select your preferred theater and showtime</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Enhanced Date Selection */}
                <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-red-600" />
                                Select Show Date
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Choose your preferred date to view available theaters and showtimes
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



                {/* Theaters and Showtimes */}
                {Object.keys(theaterGroups).length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No shows available</h3>
                        <p className="text-gray-500 mb-4">
                            This movie is not scheduled for {new Date(selectedDate).toLocaleDateString()} at any theater.
                        </p>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 max-w-md mx-auto">
                            <p className="text-sm text-yellow-800">
                                <strong>Note:</strong> If you're an admin, please create shows for this movie using the Admin Panel.
                            </p>
                        </div>
                        <div className="space-x-4">
                            <Link 
                                to="/theaters" 
                                className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
                            >
                                Browse All Theaters →
                            </Link>
                            <Link 
                                to="/admin" 
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Admin Panel →
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(theaterGroups).map(([theaterId, theaterShows]) => {
                            const theater = theaterShows[0].theater;
                            return (
                                <div key={theaterId} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Theater Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 mb-1">
                                                    {theater.name}
                                                </h3>
                                                <p className="text-gray-600 flex items-center mb-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    {theater.location}
                                                </p>
                                                
                                                {/* Theater features */}
                                                <div className="flex flex-wrap gap-2">
                                                    {theater.wheelchairAccessible && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                                            ♿ Accessible
                                                        </span>
                                                    )}
                                                    {theater.amenities.includes('Dolby Atmos') && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                                            🔊 Dolby Atmos
                                                        </span>
                                                    )}
                                                    {theater.amenities.includes('IMAX') && (
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            📽️ IMAX
                                                        </span>
                                                    )}
                                                    {theater.amenities.includes('Recliner Seats') && (
                                                        <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                                                            🪑 Recliners
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <Link
                                                to={`/theaters/${theater.id}/movies`}
                                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                                            >
                                                View All Movies →
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    {/* Showtimes Grid */}
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {theaterShows
                                                .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
                                                .map((show) => {
                                                    const occupancyPercentage = getOccupancyPercentage(show);
                                                    const availableSeats = show.totalSeats - show.bookedSeats;
                                                    
                                                    return (
                                                        <button
                                                            key={show.id}
                                                            onClick={() => handleShowSelect(show)}
                                                            disabled={availableSeats === 0}
                                                            className={`p-4 border-2 rounded-lg text-left transition-all ${
                                                                availableSeats === 0
                                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                                                    : 'border-gray-200 hover:border-red-500 hover:bg-red-50 hover:shadow-md'
                                                            }`}
                                                        >
                                                            <div className="flex items-center justify-between mb-2">
                                                                <div className="text-lg font-bold text-gray-800">
                                                                    {new Date(show.startTime).toLocaleTimeString('en-US', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                        hour12: true
                                                                    })}
                                                                </div>
                                                                {show.isPremium && (
                                                                    <Crown className="w-4 h-4 text-yellow-500" />
                                                                )}
                                                            </div>
                                                            
                                                            <div className="space-y-1">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-600">Price</span>
                                                                    <span className="font-semibold text-gray-800">
                                                                        ₹{show.currentPrice || show.basePrice}
                                                                    </span>
                                                                </div>
                                                                
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-600">Available</span>
                                                                    <span className={`font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                                                                        {availableSeats} seats
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Occupancy bar */}
                                                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                                                    <div 
                                                                        className={`h-1.5 rounded-full transition-all ${
                                                                            occupancyPercentage >= 80 ? 'bg-red-500' :
                                                                            occupancyPercentage >= 60 ? 'bg-orange-500' :
                                                                            occupancyPercentage >= 40 ? 'bg-yellow-500' :
                                                                            'bg-green-500'
                                                                        }`}
                                                                        style={{ width: `${occupancyPercentage}%` }}
                                                                    ></div>
                                                                </div>
                                                                
                                                                {show.isPremium && (
                                                                    <div className="text-xs text-yellow-600 font-medium mt-1">
                                                                        Premium Experience
                                                                    </div>
                                                                )}
                                                                
                                                                {availableSeats === 0 && (
                                                                    <div className="text-xs text-red-600 font-medium mt-1">
                                                                        Sold Out
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </button>
                                                    );
                                                })}
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

export default BookShow;