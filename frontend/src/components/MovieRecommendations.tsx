import React, { useState, useEffect } from 'react';
import { recommendationsApi } from '../api/services';
import type { Movie } from '../types';
import { Sparkles, TrendingUp, Calendar, Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MovieRecommendationsProps {
    currentMovieId?: number;
}

const MovieRecommendations: React.FC<MovieRecommendationsProps> = ({ currentMovieId }) => {
    const [personalizedMovies, setPersonalizedMovies] = useState<Movie[]>([]);
    const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
    const [newReleases, setNewReleases] = useState<Movie[]>([]);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [activeTab, setActiveTab] = useState<'personalized' | 'trending' | 'new' | 'similar'>('personalized');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecommendations();
    }, [currentMovieId]);

    const loadRecommendations = async () => {
        setLoading(true);
        try {
            const promises = [
                recommendationsApi.getPersonalized(),
                recommendationsApi.getTrending(),
                recommendationsApi.getNewReleases()
            ];

            if (currentMovieId) {
                promises.push(recommendationsApi.getSimilar(currentMovieId));
            }

            const results = await Promise.all(promises);

            setPersonalizedMovies(results[0].data);
            setTrendingMovies(results[1].data);
            setNewReleases(results[2].data);

            if (currentMovieId && results[3]) {
                setSimilarMovies(results[3].data);
                setActiveTab('similar');
            }
        } catch (error) {
            console.error('Error loading recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs: {
        id: 'personalized' | 'trending' | 'new' | 'similar';
        label: string;
        icon: any;
        movies: Movie[];
        description: string;
    }[] = [
            {
                id: 'personalized' as const,
                label: 'For You',
                icon: Sparkles,
                movies: personalizedMovies,
                description: 'Based on your viewing history'
            },
            {
                id: 'trending' as const,
                label: 'Trending',
                icon: TrendingUp,
                movies: trendingMovies,
                description: 'Most popular this week'
            },
            {
                id: 'new' as const,
                label: 'New Releases',
                icon: Calendar,
                movies: newReleases,
                description: 'Latest movies in theaters'
            }
        ];

    if (currentMovieId && similarMovies.length > 0) {
        tabs.push({
            id: 'similar' as const,
            label: 'Similar Movies',
            icon: Heart,
            movies: similarMovies,
            description: 'Movies you might also like'
        });
    }

    const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
        <Link
            to={`/movies/${movie.id}`}
            className="group block bg-card rounded-lg overflow-hidden card-hover"
        >
            <div className="aspect-[2/3] relative overflow-hidden">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center gap-2 mb-2">
                        {movie.averageRating > 0 && (
                            <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-medium">{movie.averageRating.toFixed(1)}</span>
                            </div>
                        )}
                        {movie.isNewRelease && (
                            <div className="bg-primary rounded px-2 py-1">
                                <span className="text-xs font-bold">NEW</span>
                            </div>
                        )}
                    </div>
                    <h4 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <span>{movie.genre}</span>
                        <span>•</span>
                        <span>{movie.durationMin}min</span>
                    </div>
                </div>
            </div>
        </Link>
    );

    if (loading) {
        return (
            <div className="bg-card rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-gray-700 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const activeTabData = tabs.find(tab => tab.id === activeTab);

    return (
        <div className="bg-card rounded-lg p-6">
            <div className="mb-6">
                <h3 className="text-xl font-heading mb-4">Recommended Movies</h3>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${activeTab === tab.id
                                ? 'bg-primary text-white'
                                : 'bg-dark/50 text-muted hover:bg-dark hover:text-white'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span className="font-medium">{tab.label}</span>
                            {tab.movies.length > 0 && (
                                <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                                    {tab.movies.length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Description */}
                {activeTabData && (
                    <p className="text-muted text-sm mb-4">{activeTabData.description}</p>
                )}
            </div>

            {/* Movies Grid */}
            {activeTabData?.movies.length === 0 ? (
                <div className="text-center py-12">
                    <activeTabData.icon className="w-12 h-12 text-muted mx-auto mb-3 opacity-50" />
                    <p className="text-muted">No recommendations available</p>
                    <p className="text-sm text-muted mt-1">
                        {activeTab === 'personalized'
                            ? 'Book some movies to get personalized recommendations!'
                            : 'Check back later for updates.'
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {activeTabData?.movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}

            {/* View All Link */}
            {activeTabData && activeTabData.movies.length > 0 && (
                <div className="text-center mt-6">
                    <Link
                        to={`/?category=${activeTab}`}
                        className="btn-outline inline-flex items-center gap-2"
                    >
                        View All {activeTabData.label}
                        <TrendingUp className="w-4 h-4" />
                    </Link>
                </div>
            )}
        </div>
    );
};

export default MovieRecommendations;