import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { analyticsApi, pricingApi } from "../api/services";
import { useNotification } from "../context/NotificationContext";
// Temporary type definitions
interface AnalyticsData {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  dailyRevenue: Array<{
    date: string;
    revenue: number;
  }>;
  revenueGrowth: number;
}

interface PricingData {
  showId: number;
  movieTitle: string;
  theaterName: string;
  startTime: string;
  basePrice: number;
  currentPrice: number;
  occupancyRate: number;
  availableSeats: number;
}
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  Star,
  Calendar,
  Settings,
  Plus,
  Eye,
  Zap,
  Trash2,
  Edit,
  ArrowLeft,
} from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { showSuccess, showError, showWarning, showInfo } = useNotification();
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "analytics"
    | "pricing"
    | "movies"
    | "theaters"
    | "shows"
    | "manage"
  >("dashboard");
  const [message, setMessage] = useState("");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [pricingData, setPricingData] = useState<PricingData[]>([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  // Movie Form State
  const [movieForm, setMovieForm] = useState({
    title: "",
    description: "",
    durationMin: 0,
    language: "",
    posterUrl: "",
    genre: "",
    rating: "",
    releaseDate: "",
    director: "",
    cast: "",
    isNewRelease: false,
  });

  // Theater Form State
  const [theaterForm, setTheaterForm] = useState({
    name: "",
    location: "",
    wheelchairAccessible: true,
    hearingLoopAvailable: false,
    hasElevator: false,
    wheelchairSeats: 0,
    amenities: [] as string[],
    parkingInfo: "",
    contactNumber: "",
  });

  // Show Form State
  const [showForm, setShowForm] = useState({
    movieId: 0,
    selectedTheaters: [] as number[],
    showtimes: [] as {
      theaterId: number;
      startTime: string;
      totalSeats: number;
      basePrice: number;
      isPremium: boolean;
    }[],
    basePrice: 0,
    totalSeats: 100,
  });

  // Data for dropdowns
  const [movies, setMovies] = useState<any[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [shows, setShows] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [editingShow, setEditingShow] = useState<any>(null);

  useEffect(() => {
    if (activeTab === "analytics") {
      loadAnalyticsData();
    } else if (activeTab === "pricing") {
      loadPricingData();
    } else if (activeTab === "shows") {
      loadMoviesAndTheaters();
    } else if (activeTab === "manage") {
      loadAllData();
    }
  }, [activeTab, dateRange]);

  const loadMoviesAndTheaters = async () => {
    setLoadingData(true);
    try {
      const [moviesResponse, theatersResponse] = await Promise.all([
        api.get("/movies"),
        api.get("/theaters"),
      ]);
      setMovies(moviesResponse.data || []);
      setTheaters(theatersResponse.data || []);
    } catch (error) {
      console.error("Error loading movies and theaters:", error);
      showError("Failed to load data", "Could not load movies and theaters");
    } finally {
      setLoadingData(false);
    }
  };

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await analyticsApi.getRevenueAnalytics(
        dateRange.startDate,
        dateRange.endDate
      );
      setAnalyticsData(response.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
      showError("Analytics Error", "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const loadPricingData = async () => {
    setLoading(true);
    try {
      const response = await pricingApi.getAllShowsPricing();
      setPricingData(response.data);
    } catch (error) {
      console.error("Error loading pricing data:", error);
      showError("Pricing Error", "Failed to load pricing data");
    } finally {
      setLoading(false);
    }
  };

  const updateShowPricing = async (showId: number) => {
    try {
      await pricingApi.updateShowPricing(showId);
      showSuccess(
        "Pricing Updated",
        "Show pricing has been updated successfully"
      );
      loadPricingData(); // Reload data
    } catch (error) {
      showError("Update Failed", "Failed to update pricing");
    }
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!movieForm.title || !movieForm.description || !movieForm.durationMin || 
        !movieForm.language || !movieForm.posterUrl || !movieForm.genre || 
        !movieForm.rating || !movieForm.releaseDate) {
      showError(
        "Validation Error",
        "Please fill in all required fields marked with *"
      );
      return;
    }

    try {
      const movieData = {
        ...movieForm,
        durationMin: Number(movieForm.durationMin),
        cast: movieForm.cast
          ? movieForm.cast.split(",").map((actor) => actor.trim())
          : [],
        releaseDate: new Date(movieForm.releaseDate).toISOString(),
      };
      await api.post("/movies", movieData);
      showSuccess(
        "Movie Added! 🎬",
        `${movieData.title} has been added successfully`
      );
      setMovieForm({
        title: "",
        description: "",
        durationMin: 0,
        language: "",
        posterUrl: "",
        genre: "",
        rating: "",
        releaseDate: "",
        director: "",
        cast: "",
        isNewRelease: false,
      });
    } catch (error: any) {
      showError(
        "Failed to Add Movie",
        error.response?.data?.message || "Please check all required fields"
      );
    }
  };

  const handleTheaterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/theaters", theaterForm);
      showSuccess(
        "Theater Added! 🎭",
        `${theaterForm.name} has been added successfully`
      );
      setTheaterForm({
        name: "",
        location: "",
        wheelchairAccessible: true,
        hearingLoopAvailable: false,
        hasElevator: false,
        wheelchairSeats: 0,
        amenities: [],
        parkingInfo: "",
        contactNumber: "",
      });
    } catch (error: any) {
      showError(
        "Failed to Add Theater",
        error.response?.data?.message || "Please check all required fields"
      );
    }
  };

  const handleShowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (showForm.showtimes.length === 0) {
      showWarning("No Showtimes", "Please add at least one showtime");
      return;
    }

    try {
      // Create multiple shows - one for each theater-time combination
      const showPromises = showForm.showtimes.map((showtime) =>
        api.post("/shows", {
          movieId: showForm.movieId,
          theaterId: showtime.theaterId,
          startTime: showtime.startTime,
          totalSeats: showtime.totalSeats,
          basePrice: showtime.basePrice,
          currentPrice: showtime.basePrice,
          isPremium: showtime.isPremium,
          isSpecialScreening: false,
        })
      );

      await Promise.all(showPromises);
      showSuccess(
        "Shows Created! 🎬",
        `Successfully created ${showForm.showtimes.length} shows`
      );

      // Reset form
      setShowForm({
        movieId: 0,
        selectedTheaters: [],
        showtimes: [],
        basePrice: 0,
        totalSeats: 100,
      });
    } catch (error: any) {
      showError(
        "Failed to Create Shows",
        error.response?.data?.message || "Please check all fields"
      );
    }
  };

  const addShowtime = () => {
    if (showForm.selectedTheaters.length === 0) {
      showWarning(
        "No Theaters Selected",
        "Please select at least one theater first"
      );
      return;
    }

    const newShowtimes = showForm.selectedTheaters.map((theaterId) => ({
      theaterId,
      startTime: "",
      totalSeats: showForm.totalSeats,
      basePrice: showForm.basePrice,
      isPremium: false,
    }));

    setShowForm({
      ...showForm,
      showtimes: [...showForm.showtimes, ...newShowtimes],
    });
  };

  const removeShowtime = (index: number) => {
    const newShowtimes = showForm.showtimes.filter((_, i) => i !== index);
    setShowForm({ ...showForm, showtimes: newShowtimes });
  };

  const updateShowtime = (index: number, field: string, value: any) => {
    const newShowtimes = [...showForm.showtimes];
    newShowtimes[index] = { ...newShowtimes[index], [field]: value };
    setShowForm({ ...showForm, showtimes: newShowtimes });
  };

  // Management functions
  const loadAllData = async () => {
    setLoadingData(true);
    try {
      const [moviesResponse, theatersResponse, showsResponse] =
        await Promise.all([
          api.get("/movies"),
          api.get("/theaters"),
          api.get("/shows"),
        ]);
      setMovies(moviesResponse.data || []);
      setTheaters(theatersResponse.data || []);
      setShows(showsResponse.data || []);
    } catch (error) {
      console.error("Error loading data:", error);
      showError("Loading Error", "Failed to load data");
    } finally {
      setLoadingData(false);
    }
  };

  const deleteMovie = async (movieId: number) => {
    if (
      !confirm(
        "Are you sure you want to delete this movie? This will also delete all associated shows."
      )
    )
      return;

    try {
      await api.delete(`/movies/${movieId}`);
      showSuccess(
        "Movie Deleted",
        "Movie and associated shows have been deleted"
      );
      // Force refresh by filtering out the deleted movie immediately
      setMovies((prev) => prev.filter((m) => m.id !== movieId));
      setShows((prev) => prev.filter((s) => s.movie?.id !== movieId));
      // Also reload from server
      setTimeout(loadAllData, 500);
    } catch (error: any) {
      console.error("Delete movie error:", error);
      showError(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete movie"
      );
    }
  };

  const deleteShow = async (showId: number) => {
    if (!confirm("Are you sure you want to delete this show?")) return;

    try {
      await api.delete(`/shows/${showId}`);
      showSuccess("Show Deleted", "Show has been deleted successfully");
      // Force refresh by filtering out the deleted show immediately
      setShows((prev) => prev.filter((s) => s.id !== showId));
      // Also reload from server
      setTimeout(loadAllData, 500);
    } catch (error: any) {
      console.error("Delete show error:", error);
      showError(
        "Delete Failed",
        error.response?.data?.message || "Failed to delete show"
      );
    }
  };

  const updateMovie = async (movieId: number, movieData: any) => {
    try {
      await api.put(`/movies/${movieId}`, movieData);
      showSuccess(
        "Movie Updated",
        "Movie details have been updated successfully"
      );
      setEditingMovie(null);
      loadAllData();
    } catch (error: any) {
      showError(
        "Update Failed",
        error.response?.data?.message || "Failed to update movie"
      );
    }
  };

  const updateShow = async (showId: number, showData: any) => {
    try {
      await api.put(`/shows/${showId}`, showData);
      showSuccess(
        "Show Updated",
        "Show details have been updated successfully"
      );
      setEditingShow(null);
      loadAllData();
    } catch (error: any) {
      showError(
        "Update Failed",
        error.response?.data?.message || "Failed to update show"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Go Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
      </div>

      <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

      {/* Enhanced Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
        {[
          { key: "dashboard", label: "Overview", icon: Eye },
          { key: "analytics", label: "Analytics", icon: BarChart3 },
          { key: "pricing", label: "Dynamic Pricing", icon: Zap },
          { key: "movies", label: "Add Movies", icon: Plus },
          { key: "theaters", label: "Add Theaters", icon: Plus },
          { key: "shows", label: "Add Shows", icon: Plus },
          { key: "manage", label: "Manage Content", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-primary text-white"
                : "bg-card text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Overview */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-6 h-6 text-green-400" />
                <span className="text-sm text-muted">Revenue (30d)</span>
              </div>
              <div className="text-2xl font-bold">$12,450</div>
              <div className="text-sm text-green-400">
                +15.3% from last month
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-6 h-6 text-blue-400" />
                <span className="text-sm text-muted">Total Bookings</span>
              </div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-blue-400">+8.2% from last month</div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-sm text-muted">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold">4.6</div>
              <div className="text-sm text-yellow-400">
                +0.2 from last month
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <span className="text-sm text-muted">Occupancy Rate</span>
              </div>
              <div className="text-2xl font-bold">73%</div>
              <div className="text-sm text-purple-400">
                +5.1% from last month
              </div>
            </div>
          </div>

          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab("analytics")}
                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
              >
                <BarChart3 className="w-6 h-6 text-blue-400" />
                <div className="text-left">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-sm text-muted">
                    Revenue, trends, insights
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("pricing")}
                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Zap className="w-6 h-6 text-yellow-400" />
                <div className="text-left">
                  <div className="font-medium">Manage Pricing</div>
                  <div className="text-sm text-muted">
                    Dynamic pricing controls
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("movies")}
                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Plus className="w-6 h-6 text-green-400" />
                <div className="text-left">
                  <div className="font-medium">Add Content</div>
                  <div className="text-sm text-muted">
                    Movies, theaters, shows
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <div className="flex gap-3">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                className="input-field"
              />
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                className="input-field"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : analyticsData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-bold text-green-400">
                      ₹{analyticsData.totalRevenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Bookings</span>
                    <span className="font-bold">
                      {analyticsData.totalBookings}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Booking Value</span>
                    <span className="font-bold">
                      ₹{analyticsData.averageBookingValue.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Growth</span>
                    <span
                      className={`font-bold ${
                        analyticsData.revenueGrowth >= 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {analyticsData.revenueGrowth >= 0 ? "+" : ""}
                      {analyticsData.revenueGrowth.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4">Daily Revenue Trend</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {analyticsData.dailyRevenue.map((day, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{new Date(day.date).toLocaleDateString()}</span>
                      <span className="font-medium">
                        ₹{day.revenue.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-muted">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No analytics data available for the selected period</p>
            </div>
          )}
        </div>
      )}

      {/* Dynamic Pricing Tab */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Dynamic Pricing Management</h2>
            <button
              onClick={loadPricingData}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Loading..." : "Refresh Pricing"}
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {pricingData.map((show) => (
                <div key={show.showId} className="bg-card p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">{show.movieTitle}</h3>
                      <p className="text-sm text-muted">
                        {show.theaterName} •{" "}
                        {new Date(show.startTime).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => updateShowPricing(show.showId)}
                      className="btn-secondary"
                    >
                      Update Pricing
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm text-muted">Base Price</div>
                      <div className="font-bold">
                        ₹{Number(show.basePrice).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Current Price</div>
                      <div className="font-bold text-primary">
                        ₹{Number(show.currentPrice).toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Occupancy</div>
                      <div className="font-bold">
                        {(show.occupancyRate * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted">Available Seats</div>
                      <div className="font-bold">{show.availableSeats}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          show.occupancyRate >= 0.8
                            ? "bg-red-400"
                            : show.occupancyRate >= 0.6
                            ? "bg-orange-400"
                            : show.occupancyRate >= 0.4
                            ? "bg-yellow-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${show.occupancyRate * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}

              {pricingData.length === 0 && (
                <div className="text-center py-20 text-muted">
                  <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No shows available for pricing management</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Existing Forms */}
      <div className="bg-card p-8 rounded-xl border border-white/10">
        {activeTab === "movies" && (
          <form onSubmit={handleMovieSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Add New Movie</h2>
                <p className="text-gray-400">Fill in the movie details below</p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Movie Title *
                  </label>
                  <input
                    placeholder="e.g., Ant-Man and The Wasp: Quantumania"
                    className="input-field"
                    value={movieForm.title}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre *
                  </label>
                  <select
                    className="input-field"
                    value={movieForm.genre}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, genre: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Genre</option>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Drama">Drama</option>
                    <option value="Horror">Horror</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Animation">Animation</option>
                    <option value="Documentary">Documentary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (minutes) *
                  </label>
                  <input
                    placeholder="e.g., 125"
                    type="number"
                    className="input-field"
                    value={movieForm.durationMin}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        durationMin: Number(e.target.value),
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Language *
                  </label>
                  <select
                    className="input-field"
                    value={movieForm.language}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, language: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Language</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Kannada">Kannada</option>
                    <option value="Bengali">Bengali</option>
                    <option value="Marathi">Marathi</option>
                    <option value="Gujarati">Gujarati</option>
                    <option value="Punjabi">Punjabi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rating *
                  </label>
                  <select
                    className="input-field"
                    value={movieForm.rating}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, rating: e.target.value })
                    }
                    required
                  >
                    <option value="">Select Rating</option>
                    <option value="U">U (Universal)</option>
                    <option value="UA">UA (Parental Guidance)</option>
                    <option value="A">A (Adults Only)</option>
                    <option value="S">S (Restricted)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Release Date *
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={movieForm.releaseDate}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        releaseDate: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cast & Crew */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Cast & Crew
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Director
                  </label>
                  <input
                    placeholder="e.g., Peyton Reed"
                    className="input-field"
                    value={movieForm.director}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, director: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cast (comma separated)
                  </label>
                  <input
                    placeholder="e.g., Paul Rudd, Evangeline Lilly, Michael Douglas"
                    className="input-field"
                    value={movieForm.cast}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, cast: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Media & Description */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Media & Description
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Poster URL *
                  </label>
                  <input
                    placeholder="https://image.tmdb.org/t/p/w500/poster.jpg"
                    className="input-field"
                    value={movieForm.posterUrl}
                    onChange={(e) =>
                      setMovieForm({ ...movieForm, posterUrl: e.target.value })
                    }
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Use high-quality poster images (recommended: 500x750px)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    placeholder="Enter a compelling movie description that will attract viewers..."
                    className="input-field h-32"
                    value={movieForm.description}
                    onChange={(e) =>
                      setMovieForm({
                        ...movieForm,
                        description: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Special Options */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Special Options
              </h3>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isNewRelease"
                  checked={movieForm.isNewRelease}
                  onChange={(e) =>
                    setMovieForm({
                      ...movieForm,
                      isNewRelease: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-primary bg-dark border-gray-600 rounded focus:ring-primary"
                />
                <label
                  htmlFor="isNewRelease"
                  className="text-sm font-medium text-gray-300"
                >
                  Mark as New Release (will show "NEW" badge)
                </label>
              </div>
            </div>

            {/* Preview */}
            {movieForm.posterUrl && (
              <div className="bg-dark/50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Preview
                </h3>
                <div className="flex gap-6">
                  <img
                    src={movieForm.posterUrl}
                    alt="Movie poster preview"
                    className="w-32 h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-white mb-2">
                      {movieForm.title || "Movie Title"}
                    </h4>
                    <div className="flex gap-4 text-sm text-gray-400 mb-3">
                      <span>{movieForm.genre}</span>
                      <span>{movieForm.durationMin}min</span>
                      <span>{movieForm.language}</span>
                      <span>{movieForm.rating}</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      {movieForm.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button type="submit" className="btn-primary w-full py-4 text-lg">
              Add Movie to Database
            </button>
          </form>
        )}

        {activeTab === "theaters" && (
          <form onSubmit={handleTheaterSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add New Theater
                </h2>
                <p className="text-gray-400">
                  Create a new theater location with all amenities
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Theater Name *
                  </label>
                  <input
                    placeholder="e.g., PVR Cinemas Forum Mall"
                    className="input-field"
                    value={theaterForm.name}
                    onChange={(e) =>
                      setTheaterForm({ ...theaterForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Location *
                  </label>
                  <input
                    placeholder="e.g., Koramangala, Bangalore"
                    className="input-field"
                    value={theaterForm.location}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        location: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Number
                  </label>
                  <input
                    placeholder="e.g., +91 9876543210"
                    className="input-field"
                    value={theaterForm.contactNumber}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        contactNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Wheelchair Seats
                  </label>
                  <input
                    placeholder="e.g., 4"
                    type="number"
                    min="0"
                    className="input-field"
                    value={theaterForm.wheelchairSeats}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        wheelchairSeats: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Accessibility Features */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Accessibility Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theaterForm.wheelchairAccessible}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        wheelchairAccessible: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-gray-300">Wheelchair Accessible</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theaterForm.hearingLoopAvailable}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        hearingLoopAvailable: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-gray-300">Hearing Loop Available</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={theaterForm.hasElevator}
                    onChange={(e) =>
                      setTheaterForm({
                        ...theaterForm,
                        hasElevator: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="text-gray-300">Elevator Available</span>
                </label>
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  "Food Court",
                  "Parking",
                  "ATM",
                  "Restrooms",
                  "Air Conditioning",
                  "IMAX",
                  "Dolby Atmos",
                  "Recliner Seats",
                  "Online Booking",
                  "Card Payment",
                  "Cafe",
                  "Gaming Zone",
                ].map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={theaterForm.amenities.includes(amenity)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTheaterForm({
                            ...theaterForm,
                            amenities: [...theaterForm.amenities, amenity],
                          });
                        } else {
                          setTheaterForm({
                            ...theaterForm,
                            amenities: theaterForm.amenities.filter(
                              (a) => a !== amenity
                            ),
                          });
                        }
                      }}
                      className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-gray-300">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-dark/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Parking Information
                </label>
                <textarea
                  placeholder="e.g., Free parking available for 3 hours. Valet parking available."
                  className="input-field resize-none"
                  rows={3}
                  value={theaterForm.parkingInfo}
                  onChange={(e) =>
                    setTheaterForm({
                      ...theaterForm,
                      parkingInfo: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-3 text-lg font-semibold"
            >
              Add Theater
            </button>
          </form>
        )}

        {activeTab === "shows" && (
          <form onSubmit={handleShowSubmit} className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Create Movie Shows
                </h2>
                <p className="text-gray-400">
                  Schedule a movie across multiple theaters with different
                  timings
                </p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Movie Selection */}
                <div className="bg-dark/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Select Movie
                  </h3>
                  <select
                    className="input-field w-full"
                    value={showForm.movieId}
                    onChange={(e) =>
                      setShowForm({
                        ...showForm,
                        movieId: Number(e.target.value),
                      })
                    }
                    required
                  >
                    <option value={0}>Choose a movie...</option>
                    {movies.map((movie) => (
                      <option key={movie.id} value={movie.id}>
                        {movie.title} ({movie.language}) - {movie.genre}
                      </option>
                    ))}
                  </select>

                  {showForm.movieId > 0 && (
                    <div className="mt-4 p-4 bg-black/30 rounded-lg">
                      {(() => {
                        const selectedMovie = movies.find(
                          (m) => m.id === showForm.movieId
                        );
                        return selectedMovie ? (
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                selectedMovie.posterUrl ||
                                "/api/placeholder/80/120"
                              }
                              alt={selectedMovie.title}
                              className="w-16 h-24 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-bold text-white">
                                {selectedMovie.title}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {selectedMovie.durationMin} min •{" "}
                                {selectedMovie.language} •{" "}
                                {selectedMovie.rating}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {selectedMovie.genre}
                              </p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>

                {/* Theater Selection */}
                <div className="bg-dark/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Select Theaters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                    {theaters.map((theater) => (
                      <label
                        key={theater.id}
                        className="flex items-center space-x-3 cursor-pointer p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={showForm.selectedTheaters.includes(
                            theater.id
                          )}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShowForm({
                                ...showForm,
                                selectedTheaters: [
                                  ...showForm.selectedTheaters,
                                  theater.id,
                                ],
                              });
                            } else {
                              setShowForm({
                                ...showForm,
                                selectedTheaters:
                                  showForm.selectedTheaters.filter(
                                    (id) => id !== theater.id
                                  ),
                              });
                            }
                          }}
                          className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white">
                            {theater.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {theater.location}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>

                  {showForm.selectedTheaters.length > 0 && (
                    <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-sm">
                        ✓ {showForm.selectedTheaters.length} theater(s) selected
                      </p>
                    </div>
                  )}
                </div>

                {/* Default Settings */}
                <div className="bg-dark/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Default Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Seats per Theater
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        className="input-field"
                        value={showForm.totalSeats}
                        onChange={(e) =>
                          setShowForm({
                            ...showForm,
                            totalSeats: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Base Price (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="input-field"
                        value={showForm.basePrice}
                        onChange={(e) =>
                          setShowForm({
                            ...showForm,
                            basePrice: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={addShowtime}
                    disabled={showForm.selectedTheaters.length === 0}
                    className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Add Showtimes for Selected Theaters
                    {showForm.selectedTheaters.length > 0 && (
                      <span className="bg-green-800 px-2 py-1 rounded-full text-xs">
                        {showForm.selectedTheaters.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Showtimes Configuration */}
                {showForm.showtimes.length > 0 && (
                  <div className="bg-dark/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Configure Showtimes
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {showForm.showtimes.map((showtime, index) => {
                        const theater = theaters.find(
                          (t) => t.id === showtime.theaterId
                        );
                        return (
                          <div
                            key={index}
                            className="p-4 bg-black/30 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h4 className="font-medium text-white">
                                  {theater?.name}
                                </h4>
                                <p className="text-sm text-gray-400">
                                  {theater?.location}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeShowtime(index)}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Show Time
                                </label>
                                <input
                                  type="datetime-local"
                                  className="input-field text-sm"
                                  value={showtime.startTime}
                                  onChange={(e) =>
                                    updateShowtime(
                                      index,
                                      "startTime",
                                      e.target.value
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Seats
                                </label>
                                <input
                                  type="number"
                                  min="1"
                                  className="input-field text-sm"
                                  value={showtime.totalSeats}
                                  onChange={(e) =>
                                    updateShowtime(
                                      index,
                                      "totalSeats",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-400 mb-1">
                                  Price (₹)
                                </label>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  className="input-field text-sm"
                                  value={showtime.basePrice}
                                  onChange={(e) =>
                                    updateShowtime(
                                      index,
                                      "basePrice",
                                      Number(e.target.value)
                                    )
                                  }
                                />
                              </div>
                              <div className="flex items-end">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={showtime.isPremium}
                                    onChange={(e) =>
                                      updateShowtime(
                                        index,
                                        "isPremium",
                                        e.target.checked
                                      )
                                    }
                                    className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                                  />
                                  <span className="text-xs text-gray-300">
                                    Premium
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <p className="text-blue-400 text-sm">
                        📅 {showForm.showtimes.length} show(s) configured across{" "}
                        {
                          new Set(showForm.showtimes.map((s) => s.theaterId))
                            .size
                        }{" "}
                        theater(s)
                      </p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={showForm.showtimes.length === 0}
                  className="btn-primary w-full py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create {showForm.showtimes.length} Show(s)
                </button>
              </>
            )}
          </form>
        )}

        {/* Management Tab */}
        {activeTab === "manage" && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Manage Content
                </h2>
                <p className="text-gray-400">
                  Edit, update, or delete movies and shows
                </p>
              </div>
            </div>

            {loadingData ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Movies Management */}
                <div className="bg-dark/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Movies ({movies.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {movies.map((movie) => (
                      <div key={movie.id} className="bg-card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              className="w-12 h-16 object-cover rounded"
                            />
                            <div>
                              <h4 className="font-bold text-white">
                                {movie.title}
                              </h4>
                              <p className="text-sm text-gray-400">
                                {movie.genre} • {movie.durationMin}min •{" "}
                                {movie.language}
                              </p>
                              <p className="text-xs text-gray-500">
                                Released:{" "}
                                {new Date(
                                  movie.releaseDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMovie(movie)}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteMovie(movie.id)}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shows Management */}
                <div className="bg-dark/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Shows ({shows.length})
                  </h3>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {shows.map((show) => (
                      <div key={show.id} className="bg-card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-bold text-white">
                              {show.movie?.title || "Unknown Movie"}
                            </h4>
                            <p className="text-sm text-gray-400">
                              {show.theater?.name || "Unknown Theater"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(show.startTime).toLocaleString()} • $
                              {Number(show.basePrice || 0).toFixed(2)} •
                              {show.totalSeats - show.bookedSeats}/
                              {show.totalSeats} seats
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingShow(show)}
                              className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteShow(show.id)}
                              className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Edit Movie Modal */}
            {editingMovie && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-bold mb-4">
                    Edit Movie: {editingMovie.title}
                  </h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );
                      const movieData = {
                        title: formData.get("title"),
                        description: formData.get("description"),
                        durationMin: Number(formData.get("durationMin")),
                        language: formData.get("language"),
                        genre: formData.get("genre"),
                        rating: formData.get("rating"),
                        director: formData.get("director"),
                        posterUrl: formData.get("posterUrl"),
                        isNewRelease: formData.get("isNewRelease") === "on",
                      };
                      updateMovie(editingMovie.id, movieData);
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        name="title"
                        defaultValue={editingMovie.title}
                        placeholder="Title"
                        className="input-field"
                        required
                      />
                      <input
                        name="genre"
                        defaultValue={editingMovie.genre}
                        placeholder="Genre"
                        className="input-field"
                        required
                      />
                      <input
                        name="durationMin"
                        type="number"
                        defaultValue={editingMovie.durationMin}
                        placeholder="Duration (min)"
                        className="input-field"
                        required
                      />
                      <input
                        name="language"
                        defaultValue={editingMovie.language}
                        placeholder="Language"
                        className="input-field"
                        required
                      />
                      <input
                        name="rating"
                        defaultValue={editingMovie.rating}
                        placeholder="Rating"
                        className="input-field"
                        required
                      />
                      <input
                        name="director"
                        defaultValue={editingMovie.director}
                        placeholder="Director"
                        className="input-field"
                      />
                    </div>
                    <input
                      name="posterUrl"
                      defaultValue={editingMovie.posterUrl}
                      placeholder="Poster URL"
                      className="input-field"
                    />
                    <textarea
                      name="description"
                      defaultValue={editingMovie.description}
                      placeholder="Description"
                      className="input-field h-24"
                    />
                    <label className="flex items-center gap-2 text-white">
                      <input
                        name="isNewRelease"
                        type="checkbox"
                        defaultChecked={editingMovie.isNewRelease}
                      />
                      New Release
                    </label>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary">
                        Update Movie
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingMovie(null)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit Show Modal */}
            {editingShow && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-card rounded-xl p-6 max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4">Edit Show</h3>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(
                        e.target as HTMLFormElement
                      );
                      const showData = {
                        startTime: formData.get("startTime"),
                        basePrice: Number(formData.get("basePrice")),
                        totalSeats: Number(formData.get("totalSeats")),
                        isPremium: formData.get("isPremium") === "on",
                      };
                      updateShow(editingShow.id, showData);
                    }}
                    className="space-y-4"
                  >
                    <input
                      name="startTime"
                      type="datetime-local"
                      defaultValue={new Date(editingShow.startTime)
                        .toISOString()
                        .slice(0, 16)}
                      className="input-field"
                      required
                    />
                    <input
                      name="basePrice"
                      type="number"
                      step="0.01"
                      defaultValue={editingShow.basePrice}
                      placeholder="Base Price"
                      className="input-field"
                      required
                    />
                    <input
                      name="totalSeats"
                      type="number"
                      defaultValue={editingShow.totalSeats}
                      placeholder="Total Seats"
                      className="input-field"
                      required
                    />
                    <label className="flex items-center gap-2 text-white">
                      <input
                        name="isPremium"
                        type="checkbox"
                        defaultChecked={editingShow.isPremium}
                      />
                      Premium Show
                    </label>
                    <div className="flex gap-3">
                      <button type="submit" className="btn-primary">
                        Update Show
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingShow(null)}
                        className="btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
