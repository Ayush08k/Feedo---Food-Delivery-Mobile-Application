import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVOURITES_KEY = '@feedo_favourites';

export interface FavouriteItem {
    id: number;
    name: string;
    price: string;
    restaurant: string;
    image: string;
    category?: string;
    rating?: number;
}

interface FavouritesContextType {
    favourites: FavouriteItem[];
    addFavourite: (item: FavouriteItem) => void;
    removeFavourite: (id: number) => void;
    isFavourite: (id: number) => boolean;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
    const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

    // Load persisted favourites on mount
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(FAVOURITES_KEY);
                if (stored) setFavourites(JSON.parse(stored));
            } catch (_) {}
        })();
    }, []);

    // Persist whenever favourites change
    const persist = async (items: FavouriteItem[]) => {
        try {
            await AsyncStorage.setItem(FAVOURITES_KEY, JSON.stringify(items));
        } catch (_) {}
    };

    const addFavourite = (item: FavouriteItem) => {
        setFavourites(prev => {
            if (prev.find(f => f.id === item.id)) return prev;
            const updated = [...prev, item];
            persist(updated);
            return updated;
        });
    };

    const removeFavourite = (id: number) => {
        setFavourites(prev => {
            const updated = prev.filter(f => f.id !== id);
            persist(updated);
            return updated;
        });
    };

    const isFavourite = (id: number) => favourites.some(f => f.id === id);

    return (
        <FavouritesContext.Provider value={{ favourites, addFavourite, removeFavourite, isFavourite }}>
            {children}
        </FavouritesContext.Provider>
    );
}

export const useFavourites = () => {
    const ctx = useContext(FavouritesContext);
    if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
    return ctx;
};
