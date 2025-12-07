import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import MovieCardProfessional from "../components/MovieCardProfessional";
import { moviesApi } from "../api/services-simple";
import {
  Loader2,
  Star,
  MapPin,
  Clock,
  Calendar,
  Filter,
  Search,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const HomeProfessional = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await moviesApi.getAll();
        setMovies(response.data);
        setFilteredMovies(response.data);
      } catch (error) {
        console.error("Failed to fetch movies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  useEffect(() => {
    let filtered = movies;

    // Filter by genre
    if (selectedGenre !== "All") {
      filtered = filtered.filter((movie) => movie.genre === selectedGenre);
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      filtered = filtered.filter(
        (movie) => movie.language === selectedLanguage
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (movie) =>
          movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMovies(filtered);
  }, [selectedGenre, selectedLanguage, searchTerm, movies]);

  const genres = [
    "All",
    ...Array.from(new Set(movies.map((movie) => movie.genre))),
  ];
  const languages = [
    "All",
    ...Array.from(new Set(movies.map((movie) => movie.language))),
  ];

  const nowShowingMovies = movies
    .filter((movie) => !movie.isNewRelease)
    .slice(0, 8);
  const comingSoonMovies = movies
    .filter((movie) => movie.isNewRelease)
    .slice(0, 4);
  const topRatedMovies = movies
    .filter((movie) => Number(movie.averageRating || 0) >= 4.0)
    .sort((a, b) => Number(b.averageRating || 0) - Number(a.averageRating || 0))
    .slice(0, 6);

  return (
    <div>
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Welcome & Quick Stats */}
        {user && (
          <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome back, {user.name}! 🎬
                </h2>
                <p className="text-gray-300">
                  Discover amazing movies and book your perfect seats
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {movies.length}
                  </div>
                  <div className="text-sm text-gray-400">Movies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">4.8</div>
                  <div className="text-sm text-gray-400">Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">24/7</div>
                  <div className="text-sm text-gray-400">Support</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-card rounded-xl p-6 border border-white/10">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-dark border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-primary/20 text-primary border border-primary/20 rounded-lg hover:bg-primary/30 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Genre
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {genres.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          genre === selectedGenre
                            ? "bg-primary text-white"
                            : "bg-dark text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Language
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((language) => (
                      <button
                        key={language}
                        onClick={() => setSelectedLanguage(language)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          language === selectedLanguage
                            ? "bg-primary text-white"
                            : "bg-dark text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Now Showing */}
        {nowShowingMovies.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <h2 className="text-3xl font-bold text-white">Now Showing</h2>
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                {nowShowingMovies.length} Movies
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nowShowingMovies.map((movie) => (
                <MovieCardProfessional key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Coming Soon */}
        {comingSoonMovies.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Calendar className="w-6 h-6 text-green-400" />
              <h2 className="text-3xl font-bold text-white">Coming Soon</h2>
              <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                New Releases
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {comingSoonMovies.map((movie) => (
                <MovieCardProfessional key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* Top Rated */}
        {topRatedMovies.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <Award className="w-6 h-6 text-yellow-400" />
              <h2 className="text-3xl font-bold text-white">Top Rated</h2>
              <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm font-medium">
                Audience Choice
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topRatedMovies.map((movie) => (
                <MovieCardProfessional key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        )}

        {/* All Movies with Search Results */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              <h2 className="text-3xl font-bold text-white">
                {searchTerm ? "Search Results" : "All Movies"}
              </h2>
              <span className="bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full text-sm font-medium">
                {filteredMovies.length} Movies
              </span>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : filteredMovies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredMovies.map((movie) => (
                <MovieCardProfessional key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎬</div>
              <h3 className="text-xl font-bold text-white mb-2">
                No movies found
              </h3>
              <p className="text-gray-400 mb-6">
                {searchTerm
                  ? `No movies match "${searchTerm}"`
                  : "No movies match your current filters"}
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedGenre("All");
                  setSelectedLanguage("All");
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Features Showcase */}
        <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-xl p-8 border border-primary/20">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">
            Why Choose Bookflix?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Recommendations</h3>
              <p className="text-gray-300">
                AI-powered seat selection and personalized movie suggestions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Premium Experience</h3>
              <p className="text-gray-300">
                Best-in-class theaters with premium amenities and comfort
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
              <p className="text-gray-300">
                Quick and secure booking with flexible cancellation options
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-primary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready for Your Next Movie Experience?
          </h2>
          <p className="text-white/80 text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of movie lovers who trust Bookflix for the best
            cinema experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
              Browse Movies
            </button>
            <button className="bg-white/20 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-wider hover:bg-white/30 transition-colors border border-white/20">
              Download App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeProfessional;
