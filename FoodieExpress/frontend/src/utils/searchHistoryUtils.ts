// Search history utility functions for persisting and retrieving search history

import AsyncStorage from '@react-native-async-storage/async-storage';

const SEARCH_HISTORY_KEY = '@search_history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Get search history from AsyncStorage
 */
export const getSearchHistory = async (): Promise<string[]> => {
    try {
        const history = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    } catch (error) {
        console.error('Error getting search history:', error);
        return [];
    }
};

/**
 * Save a search query to history
 */
export const saveSearchQuery = async (query: string): Promise<void> => {
    try {
        if (!query || query.trim().length < 2) {
            return;
        }

        const trimmedQuery = query.trim();
        const history = await getSearchHistory();

        // Remove duplicate if exists
        const filteredHistory = history.filter(item => item.toLowerCase() !== trimmedQuery.toLowerCase());

        // Add to beginning and limit to MAX_HISTORY_ITEMS
        const newHistory = [trimmedQuery, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);

        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.error('Error saving search query:', error);
    }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing search history:', error);
    }
};

/**
 * Remove a specific item from search history
 */
export const removeSearchHistoryItem = async (query: string): Promise<void> => {
    try {
        const history = await getSearchHistory();
        const newHistory = history.filter(item => item !== query);
        await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.error('Error removing search history item:', error);
    }
};
