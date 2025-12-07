import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, MapPin, Play, Heart, Share2 } from 'lucide-react';

const MovieCardProfessional = ({ movie }) => {
    const showtimes = ['11:30', '14:45', '16:05', '18:40', '21:00'];
    
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    };

    const getRatingColor = (rating) => {
        if (rating >= 4.5) return 'text-green-400';
        if (rating >= 4.0) return 'text-yellow-400';
        if (rating >= 3.0) return 'text-orange-400';
        return 'text-red-400';
    };

    return (
        <div className="group relative bg-card rounded-xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20">
            {/* Poster Container */}
            <div className="relative aspect-[2/3] overflow-hidden">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Play Button */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <button className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center hover:bg-primary transition-colors">
                            <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
                        </button>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <Heart className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors">
                            <Share2 className="w-5 h-5 text-white" />
                        </button>
                    </div>
                    
                    {/* Quick Info */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex flex-wrap gap-2 mb-3">
                            {showtimes.slice(0, 3).map((time, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-primary text-white text-xs rounded font-medium"
                                >
                                    {time}
                                </span>
                            ))}
                            {showtimes.length > 3 && (
                                <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
                                    +{showtimes.length - 3}
                                </span>
                            )}
                        </div>
                        
                        <Link
                            to={`/movies/${movie.id}/book`}
                            className="block w-full bg-primary hover:bg-red-700 text-white text-center py-2 rounded-lg font-medium transition-colors"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {movie.isNewRelease && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                            NEW
                        </span>
                    )}
                    {Number(movie.averageRating || 0) >= 4.5 && (
                        <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                            ⭐ TOP RATED
                        </span>
                    )}
                </div>

                {/* Rating Badge */}
                {Number(movie.averageRating || 0) > 0 && (
                    <div className="absolute bottom-4 left-4 bg-black/70 rounded-lg px-2 py-1">
                        <div className="flex items-center gap-1">
                            <Star className={`w-4 h-4 ${getRatingColor(movie.averageRating)} fill-current`} />
                            <span className="text-white text-sm font-medium">{Number(movie.averageRating || 0).toFixed(1)}</span>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Movie Details */}
            <div className="p-4">
                <Link to={`/movies/${movie.id}`} className="block">
                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {movie.title}
                    </h3>
                </Link>
                
                {/* Movie Meta */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(movie.durationMin)}</span>
                    </div>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {movie.language}
                    </span>
                </div>
                
                {/* Genre */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-300">{movie.genre}</span>
                    {movie.totalReviews > 0 && (
                        <span className="text-xs text-gray-400">({movie.totalReviews} reviews)</span>
                    )}
                </div>
                
                {/* Description Preview */}
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {movie.description}
                </p>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                    <Link
                        to={`/movies/${movie.id}`}
                        className="flex-1 bg-primary/20 text-primary text-center py-2 rounded-lg text-sm font-medium hover:bg-primary/30 transition-colors"
                    >
                        View Details
                    </Link>
                    <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors">
                        <Heart className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieCardProfessional;