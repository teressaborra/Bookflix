import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MovieCard from "../components/MovieCard";
import api from "../api/axios";
import { recommendationsApi } from "../api/services";
import type { Movie } from "../types";
import { Loader2 } from "lucide-react";

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all movies
        const moviesResponse = await api.get("/movies");
        setMovies(moviesResponse.data);
        setFilteredMovies(moviesResponse.data);

        // Fetch trending movies
        try {
          const trendingResponse = await recommendationsApi.getTrending();
          setTrendingMovies(trendingResponse.data);
        } catch (error) {
          console.log("Trending movies not available:", error);
          // Use regular movies as fallback
          setTrendingMovies(moviesResponse.data.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedGenre === "All") {
      setFilteredMovies(movies);
    } else {
      setFilteredMovies(
        movies.filter((movie) => movie.genre === selectedGenre)
      );
    }
  }, [selectedGenre, movies]);

  const genres = [
    "All",
    ...Array.from(new Set(movies.map((movie) => movie.genre))),
  ];

  return (
    <div className="bg-[#0f1014] min-h-screen">
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Filter & Search Bar - Matching the Reference */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 pb-6 border-b border-white/5">
          <div className="flex flex-wrap items-center gap-8 text-sm font-medium text-gray-400">
            <button
              className="text-white flex items-center gap-2 hover:text-red-500 transition-colors"
              onClick={() => setSelectedGenre("All")}
            >
              All formats
              <span className="text-[10px]">▼</span>
            </button>
            <button className="hover:text-white transition-colors flex items-center gap-2">
              By Date
              <span className="text-[10px]">▼</span>
            </button>
            <div className="relative group">
              <button className="hover:text-white transition-colors flex items-center gap-2">
                By category
                <span className="text-[10px]">▼</span>
              </button>
              {/* Simple hover dropdown for genres */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1a1d26] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-2">
                {genres.map((genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`block w-full text-left px-3 py-2 text-sm rounded ${
                      selectedGenre === genre
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <button className="hover:text-white transition-colors">
              Coming soon
            </button>
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full bg-transparent border-none text-sm text-white placeholder-gray-600 focus:ring-0 text-right pr-10"
            />
          </div>
        </div>

        {/* Main Movie Grid */}
        <div className="space-y-16">
          {/* Trending Section */}
          {trendingMovies.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest border-l-4 border-red-600 pl-4">
                Trending Now
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {trendingMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            </div>
          )}

          {/* Filtered Movies / All */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-widest border-l-4 border-red-600 pl-4">
              {selectedGenre === "All"
                ? "Now Showing"
                : `${selectedGenre} Movies`}
            </h2>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
              </div>
            ) : filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-500">
                No movies found in this category.
              </div>
            )}

            {/* Show More Button */}
            <div className="flex justify-end pt-8">
              <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold text-sm uppercase tracking-wider transition-colors shadow-lg shadow-red-900/20">
                Show more
              </button>
            </div>
          </div>
        </div>

        {/* Footer / Copyright Mockup as per image */}
        <div className="mt-32 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-red-600/20 rounded flex items-center justify-center text-red-600 font-bold">
              B
            </div>
            <span>© 2024 BookFlix. All rights reserved.</span>
          </div>
          <div className="flex gap-8 uppercase font-bold tracking-wider">
            <a href="#" className="hover:text-white transition-colors">
              Main
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Schedules
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Tickets
            </a>
            <a href="#" className="hover:text-white transition-colors">
              News
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social Icons Mockups */}
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
              >
                <div className="w-3 h-3 bg-current rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
