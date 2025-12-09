import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Theater {
  id: number;
  name: string;
  location: string;
  amenities: string[];
}

interface Show {
  id: number;
  startTime: string;
  totalSeats: number;
  basePrice: number;
  movie?: {
    title: string;
    genre: string;
  };
  theater?: {
    name: string;
  };
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: number;
}

export default function TheaterOwnerPanel() {
  const [theater, setTheater] = useState<Theater | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  // Form state for adding new show
  const [selectedMovieId, setSelectedMovieId] = useState<number | ''>('');
  const [showTime, setShowTime] = useState('');
  const [price, setPrice] = useState('');
  const [availableSeats, setAvailableSeats] = useState('');
  const [addingShow, setAddingShow] = useState(false);

  useEffect(() => {
    fetchTheaterData();
    fetchMovies();
  }, []);

  const fetchTheaterData = async () => {
    try {
      setLoading(true);
      // Fetch theater info
      const theaterRes = await api.get('/theater-owner/my-theater');
      console.log('Theater response:', theaterRes.data);
      setTheater(theaterRes.data);
      
      // Fetch shows
      const showsRes = await api.get('/theater-owner/my-shows');
      console.log('Shows response:', showsRes.data);
      setShows(showsRes.data);
      
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch theater data:', err);
      setError(err.response?.data?.message || 'Failed to load theater data');
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error('Failed to fetch movies:', err);
    }
  };

  const handleAddShow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedMovieId || !showTime || !price || !availableSeats) {
      setError('Please fill in all fields');
      return;
    }

    if (!theater?.id) {
      setError('Theater information not loaded. Please refresh the page.');
      return;
    }

    try {
      setAddingShow(true);
      setError('');
      
      const payload = {
        movieId: Number(selectedMovieId),
        theaterId: Number(theater.id),
        startTime: new Date(showTime).toISOString(),
        basePrice: Number(price),
        totalSeats: Number(availableSeats),
      };
      
      console.log('Sending payload:', payload);
      
      await api.post('/theater-owner/add-show', payload);

      // Reset form
      setSelectedMovieId('');
      setShowTime('');
      setPrice('');
      setAvailableSeats('');
      
      // Refresh shows list
      await fetchTheaterData();
    } catch (err: any) {
      console.error('Error adding show:', err.response?.data);
      console.error('Full error:', JSON.stringify(err.response?.data, null, 2));
      const errorMessage = Array.isArray(err.response?.data?.message)
                            ? err.response?.data?.message.join(', ') 
                            : (err.response?.data?.message || 'Failed to add show');
      setError(errorMessage);
    } finally {
      setAddingShow(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!theater) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No theater assigned to your account</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{theater.name}</h1>
          <p className="text-gray-800 text-lg">{theater.location}</p>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Add New Show Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Add New Show</h2>
          <form onSubmit={handleAddShow} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Select Movie</label>
              <select
                value={selectedMovieId}
                onChange={(e) => setSelectedMovieId(Number(e.target.value))}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              >
                <option value="">Choose a movie...</option>
                {movies.map((movie) => (
                  <option key={movie.id} value={movie.id}>
                    {movie.title} ({movie.genre}) - {movie.duration} min
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Show Time</label>
              <input
                type="datetime-local"
                value={showTime}
                onChange={(e) => setShowTime(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="12.50"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Available Seats</label>
                <input
                  type="number"
                  min="1"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="100"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={addingShow}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingShow ? 'Adding Show...' : 'Add Show'}
            </button>
          </form>
        </div>

        {/* Shows List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Your Shows</h2>
          
          {shows.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No shows scheduled yet. Add your first show above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-gray-300">Movie</th>
                    <th className="px-4 py-3 text-gray-300">Genre</th>
                    <th className="px-4 py-3 text-gray-300">Show Time</th>
                    <th className="px-4 py-3 text-gray-300">Price</th>
                    <th className="px-4 py-3 text-gray-300">Available Seats</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {shows.map((show) => (
                    <tr key={show.id} className="hover:bg-gray-700 transition">
                      <td className="px-4 py-3 text-white">{show.movie?.title || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-300">{show.movie?.genre || 'N/A'}</td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(show.startTime).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-gray-300">₹{Number(show.basePrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-300">{show.totalSeats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
