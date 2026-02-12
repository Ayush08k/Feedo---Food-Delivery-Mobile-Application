const API_BASE_URL = 'http://192.168.1.4:3000';

export interface Restaurant {
    _id: string;
    name: string;
    description?: string;
    address?: string;
    rating: number;
    imageUrl?: string;
    cuisineType?: string;
    openingTime?: string;
    closingTime?: string;
    isOpen?: boolean;
    restaurantPhone?: string;
}

export const fetchAllRestaurants = async (sortBy: string = 'rating'): Promise<Restaurant[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants?sortBy=${sortBy}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error;
    }
};

export const fetchRestaurantById = async (id: string): Promise<Restaurant> => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        throw error;
    }
};
