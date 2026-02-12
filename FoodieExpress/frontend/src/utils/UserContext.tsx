import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loadProfileData, saveProfileData, ProfileData } from './profileUtils';

interface UserContextType {
    profile: ProfileData | null;
    updateProfile: (data: Partial<ProfileData>) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);

    const loadProfile = async () => {
        const data = await loadProfileData();
        if (data) {
            setProfile(data);
        }
    };

    const updateProfile = async (data: Partial<ProfileData>) => {
        const currentProfile = profile || { role: 'user', profileImage: null, name: '', phone: '', email: '' };
        const updatedProfile: ProfileData = { ...currentProfile, ...data };
        await saveProfileData(updatedProfile);
        setProfile(updatedProfile);
    };

    const refreshProfile = async () => {
        await loadProfile();
    };

    useEffect(() => {
        loadProfile();
    }, []);

    return (
        <UserContext.Provider value={{ profile, updateProfile, refreshProfile }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
