import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Clock, Star, Filter, ChevronRight } from 'lucide-react';

const HomeModern = () => {
    const [selectedCity, setSelectedCity] = useState('Hyderabad');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLanguage, setSelectedLanguage] = useState('All');

    // Sample data - replace with API calls
    const cities = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi'];
    const languages = ['All', 'Telugu', 'Hindi', 'English', 'Tamil'];
    
    const movies = [
        {
            id: 1,
            title: 'Bhimavaram',
            poster: 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Bhimavaram',
            rating: 4.2,
            votes: '12.5K',
            genre: 'Action, Drama',
            language: 'Telugu',
            duration: '2h 45m',
            releaseDate: '2024-01-15',
            theaters: 45,
            shows: 180
        },
        // Add more movies...
    ];

    const trendingMovies = movies.slice(0, 6);
    const newReleases = movies.slice(0, 4);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-8">
                            <h1 className="text-2xl font-bold text-red-600">BookFlix</h1>
                            
                            {/* Search */}
                            <div className="relative hidden md:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for Movies, Events, Plays, Sports and Activities"
                                    className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Location & Auth */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                <MapPin className="w-4 h-4 text-gray-600" />
                                <select 
                                    value={selectedCity} 
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="bg-transparent border-none outline-none cursor-pointer"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">Sign In</button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-8 h-12">
                        <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Movies</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Stream</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Events</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Plays</a>
                        <a href="#" className="text-gray-700 hover:text-red-600 font-medium">Sports</a>
                    </div>
                </div>
            </nav>

            {/* Hero Banner */}
            <section className="bg-gradient-to-r from-red-600 to-pink-600 text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold mb-4">Book Movie Tickets</h2>
                        <p className="text-xl opacity-90 mb-8">Experience the magic of cinema in {selectedCity}</p>
                        
                        {/* Quick Filters */}
                        <div className="flex justify-center gap-4 flex-wrap">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`px-4 py-2 rounded-full border transition-colors ${
                                        selectedLanguage === lang 
                                            ? 'bg-white text-red-600 border-white' 
                                            : 'bg-transparent text-white border-white/30 hover:border-white'
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Trending Movies */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Trending Movies</h3>
                        <button className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium">
                            See All <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {trendingMovies.map(movie => (
                            <div key={movie.id} className="group cursor-pointer">
                                <div className="relative overflow-hidden rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
                                    <img 
                                        src={movie.poster} 
                                        alt={movie.title}
                                        className="w-full aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    
                                    {/* Rating Badge */}
                                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        {movie.rating}
                                    </div>
                                </div>
                                
                                <div className="mt-3">
                                    <h4 className="font-semibold text-gray-900 truncate">{movie.title}</h4>
                                    <p className="text-sm text-gray-600">{movie.genre}</p>
                                    <p className="text-sm text-gray-500">{movie.language}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Filters & Movies List */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Movies in {selectedCity}</h3>
                        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                    </div>

                    {/* Movie Cards */}
                    <div className="space-y-6">
                        {movies.map(movie => (
                            <div key={movie.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                                <div className="flex gap-6">
                                    <img 
                                        src={movie.poster} 
                                        alt={movie.title}
                                        className="w-32 h-48 object-cover rounded-lg"
                                    />
                                    
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h4 className="text-xl font-bold text-gray-900 mb-2">{movie.title}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-medium">{movie.rating}/5</span>
                                                        <span>({movie.votes} votes)</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{movie.language}</span>
                                                    <span>•</span>
                                                    <span>{movie.duration}</span>
                                                </div>
                                                <p className="text-gray-600 mb-4">{movie.genre}</p>
                                            </div>
                                            
                                            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                                                Book Tickets
                                            </button>
                                        </div>
                                        
                                        {/* Show Times */}
                                        <div className="border-t pt-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-sm font-medium text-gray-700">Today, 15 Jan</span>
                                            </div>
                                            
                                            <div className="flex flex-wrap gap-2">
                                                {['10:30 AM', '1:45 PM', '4:30 PM', '7:15 PM', '10:00 PM'].map(time => (
                                                    <button 
                                                        key={time}
                                                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:border-red-600 hover:text-red-600 transition-colors"
                                                    >
                                                        {time}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomeModern;