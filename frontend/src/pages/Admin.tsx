import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { analyticsApi, pricingApi } from '../api/services';
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
    Zap
} from 'lucide-react';

const Admin = () => {
    const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'pricing' | 'movies' | 'theaters' | 'shows'>('dashboard');
    const [message, setMessage] = useState('');
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [pricingData, setPricingData] = useState<PricingData[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);

    // Movie Form State
    const [movieForm, setMovieForm] = useState({
        title: '', 
        description: '', 
        durationMin: 0, 
        language: '', 
        posterUrl: '',
        genre: '',
        rating: '',
        releaseDate: '',
        director: '',
        cast: '',
        isNewRelease: false
    });

    // Theater Form State
    const [theaterForm, setTheaterForm] = useState({
        name: '', 
        location: '',
        wheelchairAccessible: true,
        hearingLoopAvailable: false,
        hasElevator: false,
        wheelchairSeats: 0,
        amenities: [] as string[],
        parkingInfo: '',
        contactNumber: ''
    });

    // Show Form State
    const [showForm, setShowForm] = useState({
        movieId: 0, theaterId: 0, startTime: '', totalSeats: 0, basePrice: 0
    });

    useEffect(() => {
        if (activeTab === 'analytics') {
            loadAnalyticsData();
        } else if (activeTab === 'pricing') {
            loadPricingData();
        }
    }, [activeTab, dateRange]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            const response = await analyticsApi.getRevenueAnalytics(dateRange.startDate, dateRange.endDate);
            setAnalyticsData(response.data);
        } catch (error) {
            console.error('Error loading analytics:', error);
            setMessage('Failed to load analytics data');
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
            console.error('Error loading pricing data:', error);
            setMessage('Failed to load pricing data');
        } finally {
            setLoading(false);
        }
    };

    const updateShowPricing = async (showId: number) => {
        try {
            await pricingApi.updateShowPricing(showId);
            setMessage('Pricing updated successfully!');
            loadPricingData(); // Reload data
        } catch (error) {
            setMessage('Failed to update pricing');
        }
    };

    const handleMovieSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const movieData = {
                ...movieForm,
                durationMin: Number(movieForm.durationMin),
                cast: movieForm.cast ? movieForm.cast.split(',').map(actor => actor.trim()) : [],
                releaseDate: new Date(movieForm.releaseDate).toISOString()
            };
            await api.post('/movies', movieData);
            setMessage('Movie added successfully! 🎬');
            setMovieForm({ 
                title: '', 
                description: '', 
                durationMin: 0, 
                language: '', 
                posterUrl: '',
                genre: '',
                rating: '',
                releaseDate: '',
                director: '',
                cast: '',
                isNewRelease: false
            });
        } catch (error) {
            setMessage('Failed to add movie. Please check all required fields.');
        }
    };

    const handleTheaterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/theaters', theaterForm);
            setMessage('Theater added successfully! 🎭');
            setTheaterForm({ 
                name: '', 
                location: '',
                wheelchairAccessible: true,
                hearingLoopAvailable: false,
                hasElevator: false,
                wheelchairSeats: 0,
                amenities: [],
                parkingInfo: '',
                contactNumber: ''
            });
        } catch (error) {
            setMessage('Failed to add theater');
        }
    };

    const handleShowSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/shows', {
                ...showForm,
                movieId: Number(showForm.movieId),
                theaterId: Number(showForm.theaterId),
                totalSeats: Number(showForm.totalSeats),
                basePrice: Number(showForm.basePrice),
                currentPrice: Number(showForm.basePrice)
            });
            setMessage('Show added successfully!');
            setShowForm({ movieId: 0, theaterId: 0, startTime: '', totalSeats: 0, basePrice: 0 });
        } catch (error) {
            setMessage('Failed to add show');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold text-white mb-8">Admin Dashboard</h1>

            {/* Enhanced Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
                {[
                    { key: 'dashboard', label: 'Overview', icon: Eye },
                    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                    { key: 'pricing', label: 'Dynamic Pricing', icon: Zap },
                    { key: 'movies', label: 'Add Movies', icon: Plus },
                    { key: 'theaters', label: 'Add Theaters', icon: Plus },
                    { key: 'shows', label: 'Add Shows', icon: Plus }
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-colors ${
                            activeTab === tab.key
                                ? 'bg-primary text-white'
                                : 'bg-card text-gray-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {message && (
                <div className={`p-4 rounded mb-8 ${
                    message.includes('Failed') || message.includes('Error')
                        ? 'bg-red-500/10 border border-red-500/20 text-red-500'
                        : 'bg-green-500/10 border border-green-500/20 text-green-500'
                }`}>
                    {message}
                </div>
            )}

            {/* Dashboard Overview */}
            {activeTab === 'dashboard' && (
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-card p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <DollarSign className="w-6 h-6 text-green-400" />
                                <span className="text-sm text-muted">Revenue (30d)</span>
                            </div>
                            <div className="text-2xl font-bold">$12,450</div>
                            <div className="text-sm text-green-400">+15.3% from last month</div>
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
                            <div className="text-sm text-yellow-400">+0.2 from last month</div>
                        </div>
                        
                        <div className="bg-card p-6 rounded-lg">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp className="w-6 h-6 text-purple-400" />
                                <span className="text-sm text-muted">Occupancy Rate</span>
                            </div>
                            <div className="text-2xl font-bold">73%</div>
                            <div className="text-sm text-purple-400">+5.1% from last month</div>
                        </div>
                    </div>

                    <div className="bg-card p-6 rounded-lg">
                        <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button 
                                onClick={() => setActiveTab('analytics')}
                                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <BarChart3 className="w-6 h-6 text-blue-400" />
                                <div className="text-left">
                                    <div className="font-medium">View Analytics</div>
                                    <div className="text-sm text-muted">Revenue, trends, insights</div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('pricing')}
                                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Zap className="w-6 h-6 text-yellow-400" />
                                <div className="text-left">
                                    <div className="font-medium">Manage Pricing</div>
                                    <div className="text-sm text-muted">Dynamic pricing controls</div>
                                </div>
                            </button>
                            
                            <button 
                                onClick={() => setActiveTab('movies')}
                                className="flex items-center gap-3 p-4 bg-dark/50 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Plus className="w-6 h-6 text-green-400" />
                                <div className="text-left">
                                    <div className="font-medium">Add Content</div>
                                    <div className="text-sm text-muted">Movies, theaters, shows</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
                        <div className="flex gap-3">
                            <input
                                type="date"
                                value={dateRange.startDate}
                                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                                className="input-field"
                            />
                            <input
                                type="date"
                                value={dateRange.endDate}
                                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
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
                                        <span className="font-bold text-green-400">${analyticsData.totalRevenue.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Bookings</span>
                                        <span className="font-bold">{analyticsData.totalBookings}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Booking Value</span>
                                        <span className="font-bold">${analyticsData.averageBookingValue.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Revenue Growth</span>
                                        <span className={`font-bold ${analyticsData.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {analyticsData.revenueGrowth >= 0 ? '+' : ''}{analyticsData.revenueGrowth.toFixed(1)}%
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
                                            <span className="font-medium">${day.revenue.toFixed(2)}</span>
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
            {activeTab === 'pricing' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">Dynamic Pricing Management</h2>
                        <button 
                            onClick={loadPricingData}
                            className="btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Refresh Pricing'}
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
                                            <p className="text-sm text-muted">{show.theaterName} • {new Date(show.startTime).toLocaleString()}</p>
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
                                            <div className="font-bold">${show.basePrice.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted">Current Price</div>
                                            <div className="font-bold text-primary">${show.currentPrice.toFixed(2)}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-muted">Occupancy</div>
                                            <div className="font-bold">{(show.occupancyRate * 100).toFixed(1)}%</div>
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
                                                    show.occupancyRate >= 0.8 ? 'bg-red-400' :
                                                    show.occupancyRate >= 0.6 ? 'bg-orange-400' :
                                                    show.occupancyRate >= 0.4 ? 'bg-yellow-400' :
                                                    'bg-green-400'
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
                {activeTab === 'movies' && (
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
                            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Movie Title *</label>
                                    <input
                                        placeholder="e.g., Ant-Man and The Wasp: Quantumania"
                                        className="input-field"
                                        value={movieForm.title}
                                        onChange={e => setMovieForm({ ...movieForm, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Genre *</label>
                                    <select
                                        className="input-field"
                                        value={movieForm.genre}
                                        onChange={e => setMovieForm({ ...movieForm, genre: e.target.value })}
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes) *</label>
                                    <input
                                        placeholder="e.g., 125"
                                        type="number"
                                        className="input-field"
                                        value={movieForm.durationMin}
                                        onChange={e => setMovieForm({ ...movieForm, durationMin: Number(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Language *</label>
                                    <select
                                        className="input-field"
                                        value={movieForm.language}
                                        onChange={e => setMovieForm({ ...movieForm, language: e.target.value })}
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Rating *</label>
                                    <select
                                        className="input-field"
                                        value={movieForm.rating}
                                        onChange={e => setMovieForm({ ...movieForm, rating: e.target.value })}
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
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Release Date *</label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        value={movieForm.releaseDate}
                                        onChange={e => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cast & Crew */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Cast & Crew</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Director</label>
                                    <input
                                        placeholder="e.g., Peyton Reed"
                                        className="input-field"
                                        value={movieForm.director}
                                        onChange={e => setMovieForm({ ...movieForm, director: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Cast (comma separated)</label>
                                    <input
                                        placeholder="e.g., Paul Rudd, Evangeline Lilly, Michael Douglas"
                                        className="input-field"
                                        value={movieForm.cast}
                                        onChange={e => setMovieForm({ ...movieForm, cast: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Media & Description */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Media & Description</h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Poster URL *</label>
                                    <input
                                        placeholder="https://image.tmdb.org/t/p/w500/poster.jpg"
                                        className="input-field"
                                        value={movieForm.posterUrl}
                                        onChange={e => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tip: Use high-quality poster images (recommended: 500x750px)
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Description *</label>
                                    <textarea
                                        placeholder="Enter a compelling movie description that will attract viewers..."
                                        className="input-field h-32"
                                        value={movieForm.description}
                                        onChange={e => setMovieForm({ ...movieForm, description: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Special Options */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Special Options</h3>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isNewRelease"
                                    checked={movieForm.isNewRelease}
                                    onChange={e => setMovieForm({ ...movieForm, isNewRelease: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-dark border-gray-600 rounded focus:ring-primary"
                                />
                                <label htmlFor="isNewRelease" className="text-sm font-medium text-gray-300">
                                    Mark as New Release (will show "NEW" badge)
                                </label>
                            </div>
                        </div>

                        {/* Preview */}
                        {movieForm.posterUrl && (
                            <div className="bg-dark/50 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                                <div className="flex gap-6">
                                    <img 
                                        src={movieForm.posterUrl} 
                                        alt="Movie poster preview"
                                        className="w-32 h-48 object-cover rounded-lg"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                    <div className="flex-1">
                                        <h4 className="text-xl font-bold text-white mb-2">{movieForm.title || 'Movie Title'}</h4>
                                        <div className="flex gap-4 text-sm text-gray-400 mb-3">
                                            <span>{movieForm.genre}</span>
                                            <span>{movieForm.durationMin}min</span>
                                            <span>{movieForm.language}</span>
                                            <span>{movieForm.rating}</span>
                                        </div>
                                        <p className="text-gray-300 text-sm">{movieForm.description}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button type="submit" className="btn-primary w-full py-4 text-lg">
                            Add Movie to Database
                        </button>
                    </form>
                )}

                {activeTab === 'theaters' && (
                    <form onSubmit={handleTheaterSubmit} className="space-y-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                                <Plus className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Add New Theater</h2>
                                <p className="text-gray-400">Create a new theater location with all amenities</p>
                            </div>
                        </div>

                        {/* Basic Information */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Theater Name *</label>
                                    <input
                                        placeholder="e.g., PVR Cinemas Forum Mall"
                                        className="input-field"
                                        value={theaterForm.name}
                                        onChange={e => setTheaterForm({ ...theaterForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Location *</label>
                                    <input
                                        placeholder="e.g., Koramangala, Bangalore"
                                        className="input-field"
                                        value={theaterForm.location}
                                        onChange={e => setTheaterForm({ ...theaterForm, location: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Contact Number</label>
                                    <input
                                        placeholder="e.g., +91 9876543210"
                                        className="input-field"
                                        value={theaterForm.contactNumber}
                                        onChange={e => setTheaterForm({ ...theaterForm, contactNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Wheelchair Seats</label>
                                    <input
                                        placeholder="e.g., 4"
                                        type="number"
                                        min="0"
                                        className="input-field"
                                        value={theaterForm.wheelchairSeats}
                                        onChange={e => setTheaterForm({ ...theaterForm, wheelchairSeats: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Accessibility Features */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Accessibility Features</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={theaterForm.wheelchairAccessible}
                                        onChange={e => setTheaterForm({ ...theaterForm, wheelchairAccessible: e.target.checked })}
                                        className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-gray-300">Wheelchair Accessible</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={theaterForm.hearingLoopAvailable}
                                        onChange={e => setTheaterForm({ ...theaterForm, hearingLoopAvailable: e.target.checked })}
                                        className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-gray-300">Hearing Loop Available</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={theaterForm.hasElevator}
                                        onChange={e => setTheaterForm({ ...theaterForm, hasElevator: e.target.checked })}
                                        className="w-5 h-5 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2"
                                    />
                                    <span className="text-gray-300">Elevator Available</span>
                                </label>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="bg-dark/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    'Food Court', 'Parking', 'ATM', 'Restrooms', 
                                    'Air Conditioning', 'IMAX', 'Dolby Atmos', 'Recliner Seats',
                                    'Online Booking', 'Card Payment', 'Cafe', 'Gaming Zone'
                                ].map(amenity => (
                                    <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={theaterForm.amenities.includes(amenity)}
                                            onChange={e => {
                                                if (e.target.checked) {
                                                    setTheaterForm({ 
                                                        ...theaterForm, 
                                                        amenities: [...theaterForm.amenities, amenity] 
                                                    });
                                                } else {
                                                    setTheaterForm({ 
                                                        ...theaterForm, 
                                                        amenities: theaterForm.amenities.filter(a => a !== amenity) 
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
                            <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Parking Information</label>
                                <textarea
                                    placeholder="e.g., Free parking available for 3 hours. Valet parking available."
                                    className="input-field resize-none"
                                    rows={3}
                                    value={theaterForm.parkingInfo}
                                    onChange={e => setTheaterForm({ ...theaterForm, parkingInfo: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full py-3 text-lg font-semibold">
                            Add Theater
                        </button>
                    </form>
                )}

                {activeTab === 'shows' && (
                    <form onSubmit={handleShowSubmit} className="space-y-6">
                        <h2 className="text-2xl font-bold text-white mb-6">Add New Show</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                placeholder="Movie ID"
                                type="number"
                                className="input-field"
                                value={showForm.movieId}
                                onChange={e => setShowForm({ ...showForm, movieId: Number(e.target.value) })}
                                required
                            />
                            <input
                                placeholder="Theater ID"
                                type="number"
                                className="input-field"
                                value={showForm.theaterId}
                                onChange={e => setShowForm({ ...showForm, theaterId: Number(e.target.value) })}
                                required
                            />
                            <input
                                type="datetime-local"
                                className="input-field"
                                value={showForm.startTime}
                                onChange={e => setShowForm({ ...showForm, startTime: e.target.value })}
                                required
                            />
                            <input
                                placeholder="Total Seats"
                                type="number"
                                className="input-field"
                                value={showForm.totalSeats}
                                onChange={e => setShowForm({ ...showForm, totalSeats: Number(e.target.value) })}
                                required
                            />
                            <input
                                placeholder="Base Price"
                                type="number"
                                step="0.01"
                                className="input-field"
                                value={showForm.basePrice}
                                onChange={e => setShowForm({ ...showForm, basePrice: Number(e.target.value) })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary w-full">Add Show</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Admin;
