// Search utility functions for filtering food items and restaurants

/**
 * Filter food items by query matching name, restaurant, or category
 */
export const filterFoodItems = (items: any[], query: string) => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const lowerQuery = query.toLowerCase().trim();

    return items.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(lowerQuery);
        const restaurantMatch = item.restaurant?.toLowerCase().includes(lowerQuery);
        const categoryMatch = item.category?.toLowerCase().includes(lowerQuery);

        return nameMatch || restaurantMatch || categoryMatch;
    });
};

/**
 * Filter restaurants by query matching name or cuisine
 */
export const filterRestaurants = (restaurants: any[], query: string) => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const lowerQuery = query.toLowerCase().trim();

    return restaurants.filter(restaurant => {
        const nameMatch = restaurant.name?.toLowerCase().includes(lowerQuery);
        const cuisineMatch = restaurant.cuisine?.toLowerCase().includes(lowerQuery);

        return nameMatch || cuisineMatch;
    });
};

/**
 * Get top suggestions combining food items and restaurants
 */
export const getSuggestions = (
    foodItems: any[],
    restaurants: any[],
    query: string,
    limit: number = 5
) => {
    if (!query || query.trim().length < 2) {
        return [];
    }

    const filteredItems = filterFoodItems(foodItems, query);
    const filteredRestaurants = filterRestaurants(restaurants, query);

    // Combine and mark type
    const suggestions = [
        ...filteredItems.map(item => ({ ...item, type: 'food' })),
        ...filteredRestaurants.map(restaurant => ({ ...restaurant, type: 'restaurant' }))
    ];

    // Return top results
    return suggestions.slice(0, limit);
};

/**
 * Helper to highlight matching text in suggestions
 */
export const highlightMatch = (text: string, query: string): { before: string; match: string; after: string } | null => {
    if (!text || !query) {
        return null;
    }

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase().trim();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) {
        return null;
    }

    return {
        before: text.substring(0, index),
        match: text.substring(index, index + query.length),
        after: text.substring(index + query.length)
    };
};
