import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { theatersApi, showsApi } from '../api/services-simple';
import { ArrowLeft } from 'lucide-react';

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
    posterUrl: string;
    genre: string;
    language: string;
    rating: string;
}

interface Show {
    id: number;
    startTime: string;
    movie: Movie;
    theater: Theater;
}

const Theaters: React.FC = () => {
    const navigate = useNavigate();
    const [theaters, setTheaters] = useState<Theater[]>([]);
    const [theaterMovies, setTheaterMovies] = useState<{ [key: number]: Movie[] }>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');

    useEffect(() => {
        fetchTheaters();
    }, []);

    const fetchTheaters = async () => {
        try {
            const response = await theatersApi.getAll();
            const theatersData = response.data || [];
            setTheaters(theatersData);
            
            // Fetch current movies for each theater
            const moviePromises = theatersData.map(async (theater: Theater) => {
                try {
                    const showsResponse = await showsApi.getByTheater(theater.id);
                    const shows = showsResponse.data || [];
                    
                    // Get unique movies for this theater
                    const uniqueMovies = shows.reduce((acc: Movie[], show: Show) => {
                        if (!acc.find(movie => movie.id === show.movie.id)) {
                            acc.push(show.movie);
                        }
                        return acc;
                    }, []);
                    
                    return { theaterId: theater.id, movies: uniqueMovies.slice(0, 3) }; // Show max 3 movies
                } catch (error) {
                    return { theaterId: theater.id, movies: [] };
                }
            });
            
            const movieResults = await Promise.all(moviePromises);
            const movieMap = movieResults.reduce((acc, result) => {
                acc[result.theaterId] = result.movies;
                return acc;
            }, {} as { [key: number]: Movie[] });
            
            setTheaterMovies(movieMap);
        } catch (error) {
            console.error('Error fetching theaters:', error);
            setTheaters([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTheaters = theaters.filter(theater => {
        const matchesSearch = theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            theater.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = !locationFilter || theater.location.toLowerCase().includes(locationFilter.toLowerCase());
        return matchesSearch && matchesLocation;
    });

    const uniqueLocations = [...new Set(theaters.map(theater => theater.location))];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading theaters...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Go Back Button */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 pt-4 pb-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Theater Locations
                        </h1>
                        <p className="text-xl text-red-100 max-w-2xl mx-auto">
                            Discover premium cinema experiences at our state-of-the-art theaters across the city
                        </p>
                    </div>
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Search Theaters
                            </label>
                            <input
                                type="text"
                                placeholder="Search by name or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Filter by Location
                            </label>
                            <select
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Locations</option>
                                {uniqueLocations.map(location => (
                                    <option key={location} value={location}>{location}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-600">
                        Showing {filteredTheaters.length} of {theaters.length} theaters
                    </p>
                </div>

                {/* Theaters Grid */}
                {filteredTheaters.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🎭</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No theaters found</h3>
                        <p className="text-gray-500">
                            {theaters.length === 0 
                                ? "No theaters have been added yet." 
                                : "Try adjusting your search criteria."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTheaters.map(theater => (
                            <TheaterCard 
                                key={theater.id} 
                                theater={theater} 
                                movies={theaterMovies[theater.id] || []} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const TheaterCard: React.FC<{ theater: Theater; movies: Movie[] }> = ({ theater, movies }) => {
    return (
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
            {/* Theater Header */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4">
                <h3 className="text-xl font-bold mb-1">{theater.name}</h3>
                <p className="text-red-100 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {theater.location}
                </p>
            </div>

            {/* Theater Details */}
            <div className="p-4">
                {/* Accessibility Features */}
                <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Accessibility Features</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className={`flex items-center ${theater.wheelchairAccessible ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Wheelchair Access
                        </div>
                        <div className={`flex items-center ${theater.hasElevator ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Elevator
                        </div>
                        <div className={`flex items-center ${theater.hearingLoopAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Hearing Loop
                        </div>
                        {theater.wheelchairSeats > 0 && (
                            <div className="flex items-center text-blue-600">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                {theater.wheelchairSeats} Wheelchair Seats
                            </div>
                        )}
                    </div>
                </div>

                {/* Amenities */}
                {theater.amenities && theater.amenities.length > 0 && (
                    <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                            {theater.amenities.map((amenity, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                >
                                    {amenity}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact & Parking Info */}
                <div className="space-y-2 text-sm text-gray-600">
                    {theater.contactNumber && (
                        <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            {theater.contactNumber}
                        </div>
                    )}
                    {theater.parkingInfo && (
                        <div className="flex items-start">
                            <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs">{theater.parkingInfo}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Currently Playing Movies */}
            {movies.length > 0 && (
                <div className="px-4 pb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Now Playing</h4>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {movies.map((movie) => (
                            <div key={movie.id} className="text-center">
                                <img
                                    src={movie.posterUrl || '/api/placeholder/60/90'}
                                    alt={movie.title}
                                    className="w-full h-16 object-cover rounded mb-1"
                                />
                                <p className="text-xs text-gray-600 line-clamp-2 font-medium">
                                    {movie.title}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {movie.language}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Action Button */}
            <div className="px-4 pb-4">
                <Link 
                    to={`/theaters/${theater.id}/movies`}
                    className="block w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-center"
                >
                    View All Movies & Showtimes
                </Link>
            </div>
        </div>
    );
};

export default Theaters;