import React, { useState, useEffect } from 'react';
import { reviewsApi } from '../api/services';
import type { MovieReview } from '../types';
import { Star, MessageCircle, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

interface MovieReviewsProps {
    movieId: number;
    averageRating: number | null | undefined;
    totalReviews: number;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({
    movieId,
    averageRating = 0,
    totalReviews = 0
}) => {
    // Ensure averageRating is always a number
    const safeAverageRating = typeof averageRating === 'number' && !isNaN(averageRating) ? averageRating : 0;
    const safeTotalReviews = typeof totalReviews === 'number' && !isNaN(totalReviews) ? totalReviews : 0;

    // Early return if there's an issue with the data
    if (!movieId) {
        return null; // Don't render anything instead of blocking
    }
    const { user } = useAuth();
    const { showSuccess, showError } = useNotification();
    const [reviews, setReviews] = useState<MovieReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [movieId]);

    const loadReviews = async () => {
        try {
            const response = await reviewsApi.getMovieReviews(movieId);
            setReviews(response.data || []);
        } catch (error) {
            console.error('Error loading reviews:', error);
            // Don't block the UI, just show empty reviews
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSubmitting(true);
        try {
            await reviewsApi.createReview(movieId, newReview.rating, newReview.comment);
            setNewReview({ rating: 5, comment: '' });
            setShowReviewForm(false);
            loadReviews(); // Reload reviews
            // Show success message
            showSuccess('Review Submitted', 'Your review has been posted successfully!');
        } catch (error) {
            console.error('Error submitting review:', error);
            // Don't block the UI, just show error
            showError('Review Failed', 'Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!confirm('Are you sure you want to delete this review?')) return;

        try {
            await reviewsApi.deleteReview(reviewId);
            loadReviews(); // Reload reviews
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type={interactive ? "button" : undefined}
                        onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
                        className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
                        disabled={!interactive}
                    >
                        <Star
                            className={`w-5 h-5 ${star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-400'
                                }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const userHasReviewed = reviews.some(review => review.user.id === user?.id);

    return (
        <div className="bg-card rounded-lg p-6">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-heading">Reviews & Ratings</h3>
                    {user && !userHasReviewed && (
                        <button
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="btn-primary flex items-center gap-2"
                        >
                            <MessageCircle className="w-4 h-4" />
                            Write Review
                        </button>
                    )}
                </div>

                {/* Overall Rating */}
                <div className="flex items-center gap-4 p-4 bg-dark/50 rounded-lg mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{safeAverageRating.toFixed(1)}</div>
                        <div className="flex justify-center mb-1">
                            {renderStars(Math.round(safeAverageRating))}
                        </div>
                        <div className="text-sm text-muted">{safeTotalReviews} reviews</div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 ml-6">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter(r => r.rating === rating).length;
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                            return (
                                <div key={rating} className="flex items-center gap-2 mb-1">
                                    <span className="text-sm w-8">{rating}★</span>
                                    <div className="flex-1 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-muted w-8">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-dark/50 rounded-lg">
                    <h4 className="font-semibold mb-4">Write Your Review</h4>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Rating</label>
                        {renderStars(newReview.rating, true, (rating) =>
                            setNewReview(prev => ({ ...prev, rating }))
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Comment</label>
                        <textarea
                            value={newReview.comment}
                            onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                            className="input-field h-24 resize-none"
                            placeholder="Share your thoughts about this movie..."
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="btn-outline"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-8 text-muted">
                        <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No reviews yet. Be the first to review this movie!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="p-4 bg-dark/30 rounded-lg">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center font-bold">
                                        {review.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium">{review.user.name}</div>
                                        <div className="flex items-center gap-2">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-muted">
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {user?.id === review.user.id && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="text-red-400 hover:text-red-300 p-1"
                                        title="Delete review"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-300 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MovieReviews;