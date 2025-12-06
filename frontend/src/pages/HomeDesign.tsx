import React, { useEffect, useState } from 'react';
import { moviesApi } from '../api/services-simple';
import { Play, Star, Clock, Calendar, ChevronLeft, ChevronRight, Gift, Users, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const HomeDesign = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await moviesApi.getAll();
                setMovies(response.data);
            } catch (error) {
                console.error('Failed to fetch movies', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    const featuredMovie = movies[0] || {
        title: "Ant-Man and The Wasp: Quantumania",
        description: "Super-Hero partners Scott Lang and Hope Van Dyne return to continue their adventures as Ant-Man and the Wasp.",
        posterUrl: "https://image.tmdb.org/t/p/w500/ngl2FKBlU4fhbdsrtdom9LVLBXw.jpg",
        genre: "Action, Adventure, Comedy",
        rating: "PG-13",
        durationMin: 125
    };

    // Safely filter movies with default values
    const nowShowingMovies = movies.filter(movie => !movie.isNewRelease).slice(0, 4);
    const comingSoonMovies = movies.filter(movie => movie.isNewRelease).slice(0, 4);
    const latestNews = movies.slice(0, 4);

    return (
        <div className="min-h-screen bg-dark">
            {/* Hero Section - Large Featured Movie */}
            <div className="relative h-screen bg-gradient-to-r from-dark via-dark/95 to-transparent">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: `url(${featuredMovie.posterUrl})`,
                        filter: 'brightness(0.3)'
                    }}
                />
                
                {/* Content Overlay */}
                <div className="relative z-10 flex items-center h-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Left Side - Movie Info */}
                            <div className="text-white space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="bg-primary px-3 py-1 rounded-full font-bold">NEW RELEASE</span>
                                        <span className="text-gray-300">{featuredMovie.genre}</span>
                                    </div>
                                    <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                                        {featuredMovie.title}
                                    </h1>
                                </div>
                                
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                        <span>8.5/10</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span>{Math.floor(featuredMovie.durationMin / 60)}h {featuredMovie.durationMin % 60}m</span>
                                    </div>
                                    <span className="bg-gray-700 px-2 py-1 rounded">{featuredMovie.rating}</span>
                                </div>
                                
                                <p className="text-lg text-gray-300 max-w-lg leading-relaxed">
                                    {featuredMovie.description}
                                </p>
                                
                                <div className="flex gap-4 pt-4">
                                    <Link 
                                        to={`/movies/${featuredMovie.id}`}
                                        className="bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold flex items-center gap-3 transition-colors"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        BOOK NOW
                                    </Link>
                                    <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-dark transition-colors">
                                        WATCH TRAILER
                                    </button>
                                </div>
                            </div>
                            
                            {/* Right Side - Movie Poster */}
                            <div className="hidden lg:block">
                                <div className="relative">
                                    <img 
                                        src={featuredMovie.posterUrl}
                                        alt={featuredMovie.title}
                                        className="w-full max-w-md mx-auto rounded-2xl shadow-2xl"
                                    />
                                    <div className="absolute -bottom-4 -right-4 bg-primary text-white p-4 rounded-full">
                                        <Play className="w-8 h-8 fill-current" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Now Showing Section */}
            <div className="py-20 bg-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Now Showing</h2>
                            <p className="text-gray-400">Latest movies in theaters</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 bg-card border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                                <ChevronLeft className="w-5 h-5 text-white" />
                            </button>
                            <button className="p-3 bg-card border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                                <ChevronRight className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {nowShowingMovies.length > 0 ? nowShowingMovies.map((movie, index) => (
                            <div key={index} className="group relative bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-[2/3] relative overflow-hidden">
                                    <img 
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <Link 
                                                to={`/movies/${movie.id}`}
                                                className="w-full bg-primary text-white text-center py-2 rounded-lg font-medium block hover:bg-red-700 transition-colors"
                                            >
                                                Book Now
                                            </Link>
                                        </div>
                                    </div>
                                    {movie.isNewRelease && (
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">NEW</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-2 line-clamp-1">{movie.title || 'Movie Title'}</h3>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{movie.genre || 'Genre'}</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span>{movie.averageRating ? Number(movie.averageRating).toFixed(1) : '4.5'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-6xl mb-4">🎬</div>
                                <h3 className="text-xl font-bold text-white mb-2">No Movies Available</h3>
                                <p className="text-gray-400 mb-6">Add some movies through the admin panel to get started!</p>
                                <Link to="/admin" className="btn-primary">
                                    Go to Admin Panel
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="py-20 bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
                        <p className="text-gray-400">Get ready for these upcoming blockbusters</p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {comingSoonMovies.map((movie, index) => (
                            <div key={index} className="group relative bg-dark rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-[2/3] relative overflow-hidden">
                                    <img 
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">COMING SOON</span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-white mb-2 line-clamp-1">{movie.title || 'Coming Soon'}</h3>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{movie.genre || 'Genre'}</span>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Dec 2024</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Latest News Section */}
            <div className="py-20 bg-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold text-white mb-2">Latest News</h2>
                            <p className="text-gray-400">Stay updated with movie industry news</p>
                        </div>
                        <Link to="/news" className="text-primary hover:text-red-400 font-medium">
                            View All News →
                        </Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {latestNews.map((movie, index) => (
                            <div key={index} className="bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300">
                                <div className="aspect-video relative overflow-hidden">
                                    <img 
                                        src={movie.posterUrl}
                                        alt={movie.title}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-primary font-medium mb-2">MOVIE NEWS</div>
                                    <h3 className="font-bold text-white mb-2 line-clamp-2">
                                        {movie.title || 'Movie'} breaks box office records
                                    </h3>
                                    <p className="text-sm text-gray-400 line-clamp-2">
                                        Latest updates about {movie.title || 'this movie'} and its incredible success...
                                    </p>
                                    <div className="mt-3 text-xs text-gray-500">2 hours ago</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Loyalty Program Section */}
            <div className="py-20 bg-gradient-to-r from-primary/20 to-purple-600/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-8 lg:p-12 text-center">
                        <div className="max-w-3xl mx-auto">
                            <Gift className="w-16 h-16 text-white mx-auto mb-6" />
                            <h2 className="text-4xl font-bold text-white mb-4">Join Bookflix Rewards</h2>
                            <p className="text-xl text-white/90 mb-8">
                                Earn points with every booking and unlock exclusive benefits, discounts, and premium experiences.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="bg-white text-primary px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                    JOIN NOW - IT'S FREE
                                </button>
                                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-colors">
                                    LEARN MORE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20 bg-card">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-white mb-4">Why Choose Bookflix?</h2>
                        <p className="text-gray-400">Trusted by millions of movie lovers worldwide</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">10M+</div>
                            <div className="text-gray-400">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">500+</div>
                            <div className="text-gray-400">Cinema Partners</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">50+</div>
                            <div className="text-gray-400">Cities Covered</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">24/7</div>
                            <div className="text-gray-400">Customer Support</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-20 bg-dark border-t border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">Ready to Book Your Next Movie?</h2>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                        Experience the magic of cinema with the best seats, latest movies, and unbeatable convenience.
                    </p>
                    <Link 
                        to="/movies"
                        className="inline-flex items-center gap-3 bg-primary hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors"
                    >
                        <Play className="w-6 h-6 fill-current" />
                        EXPLORE MOVIES
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HomeDesign;