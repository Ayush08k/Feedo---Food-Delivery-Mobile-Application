import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DriverStatusContextType {
    isOnline: boolean;
    setIsOnline: (online: boolean) => void;
}

const DriverStatusContext = createContext<DriverStatusContextType>({
    isOnline: false,
    setIsOnline: () => {},
});

export function DriverStatusProvider({ children }: { children: ReactNode }) {
    const [isOnline, setIsOnline] = useState(false);
    return (
        <DriverStatusContext.Provider value={{ isOnline, setIsOnline }}>
            {children}
        </DriverStatusContext.Provider>
    );
}

export const useDriverStatus = () => useContext(DriverStatusContext);
