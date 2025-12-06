import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MovieCardSimple from '../components/MovieCardSimple';
import { moviesApi } from '../api/services-simple';
import { Loader2, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HomeWorking = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await moviesApi.getAll();
                setMovies(response.data);
                setFilteredMovies(response.data);
            } catch (error) {
                console.error('Failed to fetch movies', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (selectedGenre === 'All') {
            setFilteredMovies(movies);
        } else {
            setFilteredMovies(movies.filter(movie => movie.genre === selectedGenre));
        }
    }, [selectedGenre, movies]);

    const genres = ['All', ...Array.from(new Set(movies.map(movie => movie.genre)))];

    const featuredMovies = movies
        .filter(movie => movie.averageRating >= 4.0 || movie.isNewRelease)
        .slice(0, 4);

    return (
        <div>
            <Hero />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
                {/* Welcome Message */}
                {user && (
                    <div className="bg-card p-6 rounded-lg border border-primary/20">
                        <h2 className="text-2xl font-bold text-white mb-2">Welcome back, {user.name}! 🎬</h2>
                        <p className="text-gray-300">All advanced features are now available. Explore movies, book shows, and earn loyalty points!</p>
                    </div>
                )}

                {/* Featured Movies */}
                {featuredMovies.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <Star className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-3xl font-bold text-white">Featured Movies</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {featuredMovies.map((movie) => (
                                <MovieCardSimple key={movie.id} movie={movie} />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Movies with Genre Filter */}
                <div>
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm mb-2 block">What's On</span>
                            <h2 className="text-4xl font-bold text-white">All Movies</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {genres.map((genre) => (
                                <button
                                    key={genre}
                                    onClick={() => setSelectedGenre(genre)}
                                    className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors ${
                                        genre === selectedGenre
                                            ? 'bg-primary text-white'
                                            : 'bg-card text-gray-400 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-10 h-10 text-primary animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {filteredMovies.length > 0 ? (
                                filteredMovies.map((movie) => (
                                    <MovieCardSimple key={movie.id} movie={movie} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-muted text-lg">No movies found for "{selectedGenre}" genre.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Features Preview */}
                <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg p-8 border border-primary/20">
                    <h2 className="text-3xl font-bold text-white mb-6 text-center">🚀 Advanced Features Available</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-4xl mb-3">🤖</div>
                            <h3 className="text-xl font-bold mb-2">Smart Seat Selection</h3>
                            <p className="text-gray-300 text-sm">AI-powered recommendations for optimal viewing experience</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">💰</div>
                            <h3 className="text-xl font-bold mb-2">Dynamic Pricing</h3>
                            <p className="text-gray-300 text-sm">Real-time price adjustments based on demand</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-3">🎁</div>
                            <h3 className="text-xl font-bold mb-2">Loyalty Rewards</h3>
                            <p className="text-gray-300 text-sm">Earn points and unlock exclusive benefits</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Promo Section */}
            <div className="bg-primary py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">UNLIMITED MOVIES, DRAMAS, & MORE</h2>
                    <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
                        Experience the future of movie booking with AI-powered features and personalized recommendations.
                    </p>
                    <button className="bg-black text-white px-8 py-4 rounded font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomeWorking;