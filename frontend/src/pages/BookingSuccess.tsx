import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { bookingsApi } from "../api/services-simple";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Clock,
  Users,
  Ticket,
  Download,
  Share2,
  Home,
} from "lucide-react";

interface Booking {
  id: number;
  totalPrice: number;
  seats: number[];
  bookingDate: string;
  show: {
    id: number;
    startTime: string;
    movie: {
      title: string;
      posterUrl: string;
      durationMin: number;
      language: string;
      rating: string;
    };
    theater: {
      name: string;
      location: string;
    };
  };
}

const BookingSuccess: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // This would be a real API call to get booking details
      // For now, we'll simulate it
      setTimeout(() => {
        setBooking({
          id: Number(bookingId),
          totalPrice: 450,
          seats: [15, 16],
          bookingDate: new Date().toISOString(),
          show: {
            id: 1,
            startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            movie: {
              title: "Ant-Man and The Wasp: Quantumania",
              posterUrl: "/api/placeholder/200/300",
              durationMin: 125,
              language: "English",
              rating: "PG-13",
            },
            theater: {
              name: "PVR Cinemas Forum Mall",
              location: "Koramangala, Bangalore",
            },
          },
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setLoading(false);
    }
  };

  const generateTicketNumber = () => {
    return `BF${booking?.id.toString().padStart(6, "0")}`;
  };

  const handleDownloadTicket = () => {
    // Implement ticket download functionality
    alert("Ticket download feature coming soon!");
  };

  const handleShareTicket = () => {
    if (navigator.share) {
      navigator.share({
        title: `Movie Ticket - ${booking?.show.movie.title}`,
        text: `I just booked tickets for ${booking?.show.movie.title} at ${booking?.show.theater.name}!`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert("Booking link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Booking Not Found
          </h2>
          <Link to="/" className="text-red-600 hover:text-red-700">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600">
            Your tickets have been successfully booked
          </p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-1">BOOKFLIX</h2>
                <p className="text-red-100 text-sm">
                  Ticket #{generateTicketNumber()}
                </p>
              </div>
              <Ticket className="w-8 h-8 text-red-200" />
            </div>
          </div>

          {/* Movie Details */}
          <div className="p-6">
            <div className="flex gap-4 mb-6">
              <img
                src={booking.show.movie.posterUrl}
                alt={booking.show.movie.title}
                className="w-24 h-36 object-cover rounded-lg shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {booking.show.movie.title}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {booking.show.movie.durationMin} min •{" "}
                    {booking.show.movie.language} • {booking.show.movie.rating}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {booking.show.theater.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.show.theater.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Show Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(booking.show.startTime).toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>
                        {new Date(booking.show.startTime).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Booking Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{booking.seats.length} Ticket(s)</span>
                    </div>
                    <div className="flex items-center">
                      <Ticket className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Seats: {booking.seats.join(", ")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Amount */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-800">
                  Total Amount Paid
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ₹{booking.totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <div className="text-center">
              <div className="w-32 h-32 bg-white border-2 border-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="text-xs text-gray-500 text-center">
                  QR Code
                  <br />
                  (Show at theater)
                </div>
              </div>
              <p className="text-xs text-gray-500">
                Show this QR code at the theater entrance
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <button
            onClick={handleDownloadTicket}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Ticket
          </button>

          <button
            onClick={handleShareTicket}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Share2 className="w-4 h-4" />
            Share Booking
          </button>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-2">
            Important Notes:
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • Please arrive at the theater at least 15 minutes before showtime
            </li>
            <li>• Carry a valid ID proof for verification</li>
            <li>• Outside food and beverages are not allowed</li>
            <li>• Tickets are non-refundable and non-transferable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
