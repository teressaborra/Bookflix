import React from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../types';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    // Dummy showtimes for visualization matching the design
    const showtimes = ['11:30', '14:45', '16:05', '18:40', '21:00'];

    return (
        <Link to={`/movies/${movie.id}`} className="group block w-full">
            {/* Poster Container */}
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-white text-xs font-bold border border-white/10">
                    {movie.averageRating.toFixed(1)}
                </div>
            </div>

            {/* Info Section */}
            <div>
                <h3 className="text-white font-bold text-lg mb-2 uppercase tracking-wide truncate group-hover:text-red-500 transition-colors">
                    {movie.title}
                </h3>

                {/* Showtimes / Metadata matching the reference */}
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 font-medium">
                    {showtimes.slice(0, 4).map((time, i) => (
                        <span key={time} className={`flex items-center gap-1 ${i === 1 ? 'text-red-500' : ''
                            }`}>
                            {i === 1 && <span className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                            {time}
                        </span>
                    ))}
                    <span className="text-gray-600">23:15</span>
                </div>

                <div className="mt-2 text-xs text-gray-600 font-medium flex gap-2">
                    <span>{movie.durationMin} min</span>
                    <span>•</span>
                    <span>{movie.genre}</span>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
