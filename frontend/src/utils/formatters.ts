/**
 * Utility functions for formatting data safely
 */

/**
 * Safely converts a rating to a number and formats it
 * @param rating - The rating value (could be string, number, null, undefined)
 * @param defaultValue - Default value if rating is invalid (default: 0)
 * @returns Formatted rating as string with 1 decimal place
 */
export const formatRating = (rating: any, defaultValue: number = 0): string => {
    const numRating = Number(rating || defaultValue);
    return isNaN(numRating) ? defaultValue.toFixed(1) : numRating.toFixed(1);
};

/**
 * Safely converts a rating to a number for comparisons
 * @param rating - The rating value (could be string, number, null, undefined)
 * @param defaultValue - Default value if rating is invalid (default: 0)
 * @returns Safe number for comparisons
 */
export const safeRating = (rating: any, defaultValue: number = 0): number => {
    const numRating = Number(rating || defaultValue);
    return isNaN(numRating) ? defaultValue : numRating;
};

/**
 * Safely formats a price value
 * @param price - The price value (could be string, number, null, undefined)
 * @param defaultValue - Default value if price is invalid (default: 0)
 * @returns Formatted price as string with 2 decimal places
 */
export const formatPrice = (price: any, defaultValue: number = 0): string => {
    const numPrice = Number(price || defaultValue);
    return isNaN(numPrice) ? defaultValue.toFixed(2) : numPrice.toFixed(2);
};

/**
 * Safely converts a price to a number for calculations
 * @param price - The price value (could be string, number, null, undefined)
 * @param defaultValue - Default value if price is invalid (default: 0)
 * @returns Safe number for calculations
 */
export const safePrice = (price: any, defaultValue: number = 0): number => {
    const numPrice = Number(price || defaultValue);
    return isNaN(numPrice) ? defaultValue : numPrice;
};