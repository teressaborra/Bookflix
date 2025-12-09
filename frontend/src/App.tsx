import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/HomeDesign";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Admin from "./pages/Admin";
import TheaterOwnerPanel from "./pages/TheaterOwnerPanel";
import UserBookings from "./pages/UserBookings";
import LoyaltyPage from "./pages/LoyaltyPage";
import Theaters from "./pages/Theaters";
import TheaterMovies from "./pages/TheaterMovies";
import MovieTheaters from "./pages/MovieTheaters";
import BookShow from "./pages/BookShow";
import { useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";

const ProtectedRoute = ({
  children,
  adminOnly = false,
}: {
  children: React.ReactNode;
  adminOnly?: boolean;
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== "admin") return <Navigate to="/" />;

  return <>{children}</>;
};

function App() {
  return (
    <NotificationProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="theaters" element={<Theaters />} />
          <Route path="theaters/:theaterId/movies" element={<TheaterMovies />} />
          <Route path="movies/:id" element={<MovieDetails />} />
          <Route path="movies/:movieId/theaters" element={<MovieTheaters />} />
          <Route path="movies/:movieId/book" element={<BookShow />} />

          <Route
            path="booking/:showId"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          <Route
            path="booking-success/:bookingId"
            element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/bookings"
            element={
              <ProtectedRoute>
                <UserBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile/loyalty"
            element={
              <ProtectedRoute>
                <LoyaltyPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="theater-owner"
            element={
              <ProtectedRoute>
                <TheaterOwnerPanel />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </NotificationProvider>
  );
}

export default App;
