import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Movie, Show } from '../types';
import MovieReviews from '../components/MovieReviews';
import MovieRecommendations from '../components/MovieRecommendations';

import {
    MapPin,
    Star,
    Calendar,
    Subtitles,
    Eye,
    TrendingUp,
    Zap,
    ArrowLeft
} from 'lucide-react';

const MovieDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [shows, setShows] = useState<Show[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [movieRes, showsRes] = await Promise.all([
                    api.get(`/movies/${id}`),
                    api.get(`/shows?movieId=${id}`)
                ]);
                setMovie(movieRes.data);
                setShows(showsRes.data);
            } catch (error) {
                console.error('Error fetching details', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading || !movie) return (
        <div className="min-h-screen bg-[#0f1014] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="bg-[#0f1014] min-h-screen text-gray-300 font-sans">
            {/* Go Back Button */}
            <div className="relative z-20 p-4">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>
            </div>

            {/* Immersive Hero Section */}
            <div className="relative w-full h-[70vh] -mt-16 pt-16">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${movie.posterUrl})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/60 to-transparent" />
                </div>

                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
                    <div className="flex flex-col md:flex-row gap-8 items-end w-full">
                        {/* Floating Poster */}
                        <div className="hidden md:block w-72 shrink-0 rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 relative -mb-20 z-10">
                            <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 mb-4">
                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold tracking-widest uppercase mb-4 text-red-500">
                                <span>{new Date(movie.releaseDate).getFullYear()}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-500" />
                                <span>{movie.genre}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-500" />
                                <span>{movie.durationMin} min</span>
                                {movie.isNewRelease && <span className="px-2 py-0.5 bg-red-600 text-white rounded text-xs ml-2">NEW</span>}
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                                {movie.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-8 mb-8">
                                {Number(movie.averageRating || 0) > 0 && (
                                    <div className="flex items-center gap-2">
                                        <div className="flex text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(movie.averageRating || 0)) ? 'fill-current' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                        <span className="text-white font-bold text-lg">{Number(movie.averageRating || 0).toFixed(1)}</span>
                                        <span className="text-sm text-gray-500">({movie.totalReviews || 0} reviews)</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    {movie.hasAudioDescription && <span title="Audio Description" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Eye className="w-5 h-5" /></span>}
                                    {movie.hasClosedCaptions && <span title="Closed Captions" className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"><Subtitles className="w-5 h-5" /></span>}
                                </div>
                            </div>

                            <p className="text-lg text-gray-300 max-w-3xl leading-relaxed font-light">
                                {movie.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24 grid grid-cols-1 lg:grid-cols-3 gap-12">

                {/* Left Column: Shows & Pricing */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Dynamic Pricing Info - if applicable */}
                    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-1 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-400" /> Live Pricing Active
                                </h3>
                                <p className="text-sm text-gray-400">Ticket prices adjust based on real-time demand.</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">$12.99 - $24.99</div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider">Price Range</div>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                    </div>

                    {/* Shows List */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4 uppercase tracking-wider">Select Showtime</h2>
                        {shows.length === 0 ? (
                            <div className="text-center py-12 bg-[#1a1d26] rounded-xl border border-white/5">
                                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">No shows scheduled yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {shows.filter(show => show && show.id).map((show) => (
                                    <div key={show.id} className="group bg-[#1a1d26] border border-white/5 p-6 rounded-xl hover:border-red-600/50 transition-all hover:bg-[#1f222e]">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            {/* Time & Date */}
                                            <div className="flex items-center gap-6 w-full md:w-auto">
                                                <div className="text-center min-w-[80px]">
                                                    <div className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                                                        {new Date(show.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-1">
                                                        {new Date(show.startTime).toLocaleDateString(undefined, { weekday: 'short' })}
                                                    </div>
                                                </div>
                                                <div className="w-px h-12 bg-white/10 hidden md:block" />
                                                <div>
                                                    <h3 className="text-white font-bold text-lg">{show.theater.name}</h3>
                                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                                        <MapPin className="w-4 h-4" />
                                                        {show.theater.location}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Attributes */}
                                            <div className="flex gap-2">
                                                {show.isPremium && <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs font-bold rounded border border-yellow-500/20">PREMIUM</span>}
                                                {show.theater.wheelchairAccessible && <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold rounded border border-blue-500/20">ACCESSIBLE</span>}
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                                                <div className="text-right">
                                                    <div className="text-xl font-bold text-white">
                                                        ${(() => {
                                                            try {
                                                                if (show.currentPrice && typeof show.currentPrice === 'number') {
                                                                    return show.currentPrice.toFixed(2);
                                                                } else if (show.basePrice && typeof show.basePrice === 'number') {
                                                                    return show.basePrice.toFixed(2);
                                                                } else {
                                                                    return '0.00';
                                                                }
                                                            } catch (error) {
                                                                return '0.00';
                                                            }
                                                        })()}
                                                    </div>
                                                    {show.currentPrice && show.basePrice && show.currentPrice !== show.basePrice && (
                                                        <div className="text-xs text-orange-400 flex items-center justify-end gap-1">
                                                            <TrendingUp className="w-3 h-3" /> Dynamic
                                                        </div>
                                                    )}
                                                </div>
                                                <Link
                                                    to={`/booking/${show.id}`}
                                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-900/20 uppercase tracking-wider text-sm"
                                                >
                                                    Book Seat
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Reviews Section - Always show, handle errors gracefully */}
                    <div className="reviews-section">
                        <MovieReviews
                            movieId={movie.id}
                            averageRating={movie.averageRating || 0}
                            totalReviews={movie.totalReviews || 0}
                        />
                    </div>
                </div>

                {/* Right Column: Info & Recommendations */}
                <div className="space-y-8">
                    {/* Cast & Info Card */}
                    <div className="bg-[#1a1d26] border border-white/5 rounded-2xl p-6">
                        <h3 className="text-white font-bold uppercase tracking-widest mb-6 text-sm border-b border-white/5 pb-2">Film Details</h3>

                        <div className="space-y-6 text-sm">
                            <div>
                                <span className="block text-gray-500 mb-1">Director</span>
                                <span className="text-white font-medium">{movie.director}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Cast</span>
                                <span className="text-white font-medium leading-relaxed">{movie.cast?.join(', ')}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 mb-1">Language</span>
                                <span className="text-white font-medium">{movie.language}</span>
                            </div>
                            {movie.subtitleLanguages && (
                                <div>
                                    <span className="block text-gray-500 mb-1">Subtitles</span>
                                    <span className="text-white font-medium">{movie.subtitleLanguages.join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <MovieRecommendations currentMovieId={movie.id} />
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
