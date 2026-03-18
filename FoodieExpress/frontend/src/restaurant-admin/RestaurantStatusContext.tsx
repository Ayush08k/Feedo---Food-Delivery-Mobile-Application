import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RestaurantStatusContextType {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const RestaurantStatusContext = createContext<RestaurantStatusContextType>({
    isOpen: true,
    setIsOpen: () => {},
});

export function RestaurantStatusProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(true); // default: open
    return (
        <RestaurantStatusContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </RestaurantStatusContext.Provider>
    );
}

export const useRestaurantStatus = () => useContext(RestaurantStatusContext);
