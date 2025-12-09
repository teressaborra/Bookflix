import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../api/services';
import type { Booking } from '../types';
import { useNotification } from '../context/NotificationContext';
import { 
    Calendar, 
    MapPin, 
    Ticket, 
    X, 
    RefreshCw, 
    Clock, 
    CheckCircle, 
    XCircle,
    AlertCircle,
    Coins,
    CreditCard,
    MoreHorizontal,
    ArrowLeft
} from 'lucide-react';

const UserBookings = () => {
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await bookingsApi.getUserBookings();
            setBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings', error);
            // Provide fallback demo data
            setBookings([
                {
                    id: 1,
                    amountPaid: 450,
                    seats: [15, 16],
                    status: 'CONFIRMED',
                    createdAt: new Date().toISOString(),
                    paymentMethod: 'card',
                    transactionId: 'TXN_DEMO_001',
                    pointsEarned: 45,
                    pointsUsed: 0,
                    canCancel: true,
                    canReschedule: true,
                    show: {
                        id: 1,
                        startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                        movie: {
                            id: 1,
                            title: "Demo Movie",
                            posterUrl: "/api/placeholder/200/300",
                            durationMin: 125,
                            language: "English",
                            rating: "PG-13",
                            genre: "Action",
                            description: "Demo movie description",
                            releaseDate: new Date().toISOString(),
                            director: "Demo Director",
                            cast: ["Actor 1", "Actor 2"],
                            isNewRelease: true
                        },
                        theater: {
                            id: 1,
                            name: "Demo Theater",
                            location: "Demo Location",
                            wheelchairAccessible: true,
                            hearingLoopAvailable: true,
                            hasElevator: true,
                            wheelchairSeats: 10,
                            amenities: ["Dolby Atmos", "Recliner Seats"],
                            parkingInfo: "Free parking available",
                            contactNumber: "+1234567890"
                        }
                    }
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async () => {
        if (!selectedBooking) return;

        setProcessing(true);
        try {
            await bookingsApi.cancelBooking(selectedBooking.id, cancelReason);
            await fetchBookings(); // Refresh bookings
            setShowCancelModal(false);
            setSelectedBooking(null);
            setCancelReason('');
        } catch (error: any) {
            showError('Cancellation Failed', error.response?.data?.message || 'Failed to cancel booking');
        } finally {
            setProcessing(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return 'bg-green-500/20 text-green-500 border-green-500/20';
            case 'CANCELLED': return 'bg-red-500/20 text-red-500 border-red-500/20';
            case 'RESCHEDULED': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/20';
            case 'REFUNDED': return 'bg-blue-500/20 text-blue-500 border-blue-500/20';
            default: return 'bg-gray-500/20 text-gray-500 border-gray-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CONFIRMED': return <CheckCircle className="w-4 h-4" />;
            case 'CANCELLED': return <XCircle className="w-4 h-4" />;
            case 'RESCHEDULED': return <RefreshCw className="w-4 h-4" />;
            case 'REFUNDED': return <AlertCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) return <div className="text-center py-20">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
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

            <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

            {bookings.length === 0 ? (
                <div className="text-center py-20 bg-card rounded-xl border border-white/10">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Bookings Yet</h3>
                    <p className="text-gray-400">Go ahead and book your first movie!</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-card p-6 rounded-xl border border-white/10 hover:border-primary/50 transition-colors">
                            <div className="flex flex-col md:flex-row gap-6">
                                <img
                                    src={booking.show.movie.posterUrl}
                                    alt={booking.show.movie.title}
                                    className="w-24 h-36 object-cover rounded-lg shadow-lg"
                                />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{booking.show.movie.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                <MapPin className="w-4 h-4" />
                                                <span>{booking.show.theater.name}, {booking.show.theater.location}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded uppercase tracking-wider border ${getStatusColor(booking.status)}`}>
                                                {getStatusIcon(booking.status)}
                                                {booking.status}
                                            </span>
                                            {booking.status === 'CONFIRMED' && (
                                                <button
                                                    onClick={() => setSelectedBooking(booking)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Calendar className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Date & Time</p>
                                                <p className="font-bold">
                                                    {new Date(booking.show.startTime).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Ticket className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Seats</p>
                                                <p className="font-bold">{booking.seats.join(', ')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <CreditCard className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase">Payment</p>
                                                <p className="font-bold">₹{Number(booking.amountPaid || 0).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Loyalty Points Info */}
                                    {(booking.pointsEarned > 0 || booking.pointsUsed > 0) && (
                                        <div className="flex items-center gap-4 mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                            <Coins className="w-5 h-5 text-yellow-500" />
                                            <div className="flex gap-4 text-sm">
                                                {booking.pointsUsed > 0 && (
                                                    <span className="text-yellow-500">Used: {booking.pointsUsed} points</span>
                                                )}
                                                {booking.pointsEarned > 0 && (
                                                    <span className="text-green-500">Earned: {booking.pointsEarned} points</span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Cancellation/Refund Info */}
                                    {booking.status === 'CANCELLED' && booking.refundAmount && (
                                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
                                            <div className="flex items-center gap-2 text-red-400 text-sm">
                                                <XCircle className="w-4 h-4" />
                                                <span>Cancelled - Refund: ₹{booking.refundAmount.toFixed(2)} ({(booking.refundPercentage! * 100).toFixed(0)}%)</span>
                                            </div>
                                            {booking.cancellationReason && (
                                                <p className="text-sm text-gray-400 mt-1">Reason: {booking.cancellationReason}</p>
                                            )}
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span>Booking ID: #{booking.id}</span>
                                            <span>•</span>
                                            <span>Booked: {new Date(booking.createdAt).toLocaleDateString()}</span>
                                            {booking.transactionId && (
                                                <>
                                                    <span>•</span>
                                                    <span>Transaction: {booking.transactionId}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons for Selected Booking */}
                            {selectedBooking?.id === booking.id && booking.status === 'CONFIRMED' && (
                                <div className="mt-4 pt-4 border-t border-white/10 flex gap-3">
                                    {booking.canCancel && (
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel Booking
                                        </button>
                                    )}
                                    {booking.canReschedule && (
                                        <button
                                            onClick={() => {/* TODO: Implement reschedule modal */}}
                                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 rounded-lg hover:bg-yellow-500/30 transition-colors"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Reschedule
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setSelectedBooking(null)}
                                        className="px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Cancel Booking Modal */}
            {showCancelModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl p-6 max-w-md w-full border border-white/10">
                        <h3 className="text-xl font-bold mb-4">Cancel Booking</h3>
                        <p className="text-gray-400 mb-4">
                            Are you sure you want to cancel your booking for "{selectedBooking.show.movie.title}"?
                        </p>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Reason for cancellation (optional)</label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="w-full p-3 bg-dark border border-white/20 rounded-lg resize-none"
                                rows={3}
                                placeholder="Please let us know why you're cancelling..."
                            />
                        </div>

                        {/* Refund Information */}
                        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4">
                            <div className="flex items-center gap-2 text-yellow-400 text-sm mb-1">
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-medium">Refund Policy</span>
                            </div>
                            <p className="text-sm text-gray-400">
                                Refund amount depends on cancellation time:
                            </p>
                            <ul className="text-xs text-gray-500 mt-1 space-y-1">
                                <li>• More than 24 hours: 90% refund</li>
                                <li>• 2-24 hours before: 50% refund</li>
                                <li>• Less than 2 hours: No refund</li>
                            </ul>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                }}
                                className="flex-1 px-4 py-2 bg-gray-500/20 text-gray-400 border border-gray-500/20 rounded-lg hover:bg-gray-500/30 transition-colors"
                                disabled={processing}
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleCancelBooking}
                                className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                                disabled={processing}
                            >
                                {processing ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserBookings;
