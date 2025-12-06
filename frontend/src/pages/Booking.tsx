import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { bookingsApi, loyaltyApi } from '../api/services';
import type { Show, UserPoints } from '../types';
import SeatSelection from '../components/SeatSelection';
import DynamicPricing from '../components/DynamicPricing';
import { 
    Calendar, 
    MapPin, 
    Clock, 
    Users, 
    Coins, 
    CreditCard, 
    Smartphone,
    Banknote,
    Shield,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const Booking = () => {
    const { showId } = useParams<{ showId: string }>();
    const navigate = useNavigate();
    const [show, setShow] = useState<Show | null>(null);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [currentPrice, setCurrentPrice] = useState<number>(0);
    const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
    const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [step, setStep] = useState<'seats' | 'payment' | 'confirmation'>('seats');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [showRes, pointsRes] = await Promise.all([
                    api.get(`/shows/${showId}`),
                    loyaltyApi.getUserPoints().catch(() => ({ data: null }))
                ]);
                
                setShow(showRes.data);
                setCurrentPrice(showRes.data.currentPrice || showRes.data.basePrice);
                setUserPoints(pointsRes.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [showId]);

    const handleSeatsSelected = (seats: number[]) => {
        setSelectedSeats(seats);
    };

    const handlePriceUpdate = (price: number) => {
        setCurrentPrice(price);
    };

    const calculateTotal = () => {
        const subtotal = selectedSeats.length * currentPrice;
        const discount = pointsToRedeem * 0.01; // 1 point = $0.01
        return Math.max(0, subtotal - discount);
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) return;

        setBooking(true);
        try {
            const response = await bookingsApi.createBooking(
                Number(showId),
                selectedSeats,
                pointsToRedeem > 0 ? pointsToRedeem : undefined,
                paymentMethod
            );
            
            // Redirect to booking success page with booking ID
            const bookingId = response.data?.id || Math.floor(Math.random() * 1000000);
            navigate(`/booking-success/${bookingId}`);
        } catch (error: any) {
            alert(error.response?.data?.message || 'Booking failed. Please try again.');
        } finally {
            setBooking(false);
        }
    };

    const paymentMethods = [
        { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
        { id: 'mobile', name: 'Mobile Payment', icon: Smartphone },
        { id: 'cash', name: 'Pay at Counter', icon: Banknote }
    ];

    if (loading || !show) {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (step === 'confirmation') {
        return (
            <div className="min-h-screen bg-dark flex items-center justify-center">
                <div className="max-w-md mx-auto text-center">
                    <div className="bg-card rounded-lg p-8">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-heading mb-4">Booking Confirmed!</h2>
                        <p className="text-muted mb-6">
                            Your tickets have been booked successfully. You'll receive a confirmation email shortly.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/profile/bookings')}
                                className="btn-primary w-full"
                            >
                                View My Bookings
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="btn-outline w-full"
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-dark py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={show.movie.posterUrl}
                            alt={show.movie.title}
                            className="w-16 h-24 object-cover rounded"
                        />
                        <div>
                            <h1 className="text-3xl font-heading mb-2">{show.movie.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-muted">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{show.theater.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(show.startTime).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(show.startTime).toLocaleTimeString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    <span>{show.totalSeats - show.bookedSeats} seats available</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            step === 'seats' ? 'bg-primary text-white' : 'bg-card text-muted'
                        }`}>
                            <span className="font-medium">1. Select Seats</span>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                            step === 'payment' ? 'bg-primary text-white' : 'bg-card text-muted'
                        }`}>
                            <span className="font-medium">2. Payment</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {step === 'seats' && (
                            <>
                                <SeatSelection
                                    showId={Number(showId)}
                                    onSeatsSelected={handleSeatsSelected}
                                />
                                
                                {selectedSeats.length > 0 && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setStep('payment')}
                                            className="btn-primary"
                                        >
                                            Continue to Payment
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {step === 'payment' && (
                            <div className="space-y-6">
                                {/* Payment Methods */}
                                <div className="bg-card rounded-lg p-6">
                                    <h3 className="text-xl font-heading mb-4">Payment Method</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 rounded-lg border-2 transition-colors ${
                                                    paymentMethod === method.id
                                                        ? 'border-primary bg-primary/10'
                                                        : 'border-white/20 hover:border-white/40'
                                                }`}
                                            >
                                                <method.icon className="w-8 h-8 mx-auto mb-2" />
                                                <div className="font-medium">{method.name}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Loyalty Points */}
                                {userPoints && userPoints.availablePoints > 0 && (
                                    <div className="bg-card rounded-lg p-6">
                                        <h3 className="text-xl font-heading mb-4 flex items-center gap-2">
                                            <Coins className="w-5 h-5 text-yellow-400" />
                                            Use Loyalty Points
                                        </h3>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="text-sm text-muted mb-2">
                                                    Available: {userPoints.availablePoints} points (${(userPoints.availablePoints * 0.01).toFixed(2)})
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={Math.min(userPoints.availablePoints, selectedSeats.length * currentPrice * 100)}
                                                    value={pointsToRedeem}
                                                    onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="flex justify-between text-sm text-muted mt-1">
                                                    <span>0 points</span>
                                                    <span>{pointsToRedeem} points (${(pointsToRedeem * 0.01).toFixed(2)} discount)</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep('seats')}
                                        className="btn-outline"
                                    >
                                        Back to Seats
                                    </button>
                                    <button
                                        onClick={handleBooking}
                                        disabled={booking || selectedSeats.length === 0}
                                        className="btn-primary flex-1 disabled:opacity-50"
                                    >
                                        {booking ? 'Processing...' : 'Confirm Booking'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Dynamic Pricing */}
                        <DynamicPricing
                            showId={Number(showId)}
                            onPriceUpdate={handlePriceUpdate}
                        />

                        {/* Booking Summary */}
                        <div className="bg-card rounded-lg p-6 sticky top-4">
                            <h3 className="text-xl font-heading mb-4">Booking Summary</h3>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Selected Seats:</span>
                                    <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Price per seat:</span>
                                    <span>${currentPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>${(selectedSeats.length * currentPrice).toFixed(2)}</span>
                                </div>
                                {pointsToRedeem > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Points Discount:</span>
                                        <span>-${(pointsToRedeem * 0.01).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-white/20 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total:</span>
                                        <span className="text-primary">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Theater Info */}
                            <div className="border-t border-white/20 pt-4">
                                <h4 className="font-semibold mb-2">Theater Information</h4>
                                <div className="text-sm text-muted space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Shield className="w-4 h-4" />
                                        <span>
                                            {show.theater.wheelchairAccessible ? 'Wheelchair Accessible' : 'Limited Accessibility'}
                                        </span>
                                    </div>
                                    {show.theater.hearingLoopAvailable && (
                                        <div className="flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Hearing Loop Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Booking;
