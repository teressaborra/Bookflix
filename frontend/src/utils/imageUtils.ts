/**
 * Utility functions for handling images with fallbacks
 */

// Fallback image URLs
export const FALLBACK_IMAGES = {
  moviePoster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&h=750&fit=crop',
  heroBackground: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop',
  theaterImage: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&h=600&fit=crop',
};

/**
 * Handle image load error by setting fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackType: keyof typeof FALLBACK_IMAGES = 'moviePoster'
) => {
  const img = event.currentTarget;
  if (img.src !== FALLBACK_IMAGES[fallbackType]) {
    img.src = FALLBACK_IMAGES[fallbackType];
  }
};

/**
 * Get image URL with fallback
 */
export const getImageUrl = (
  url: string | undefined | null,
  fallbackType: keyof typeof FALLBACK_IMAGES = 'moviePoster'
): string => {
  return url || FALLBACK_IMAGES[fallbackType];
};
