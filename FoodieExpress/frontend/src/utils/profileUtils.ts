import AsyncStorage from '@react-native-async-storage/async-storage';

const PROFILE_KEY = '@profile_data';

export interface ProfileData {
    role: string;
    profileImage: string | null;
    name: string;
    phone: string;
    email: string;

    // Customer fields
    address?: string;

    // Driver fields
    vehicleType?: string;
    vehicleNumber?: string;
    licenseNumber?: string;
    driverAddress?: string;
    bankAccountNumber?: string;
    ifscCode?: string;
    isAvailable?: boolean;

    // Restaurant fields
    restaurantName?: string;
    ownerName?: string;
    restaurantPhone?: string;
    cuisineType?: string;
    restaurantAddress?: string;
    fssaiLicense?: string;
    gstNumber?: string;
    openingTime?: string;
    closingTime?: string;
    isOpen?: boolean;
}

export const saveProfileData = async (profileData: ProfileData): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(profileData);
        await AsyncStorage.setItem(PROFILE_KEY, jsonValue);
    } catch (error) {
        console.error('Error saving profile data:', error);
        throw error;
    }
};

export const loadProfileData = async (): Promise<ProfileData | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(PROFILE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        console.error('Error loading profile data:', error);
        return null;
    }
};

export const clearProfileData = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (error) {
        console.error('Error clearing profile data:', error);
        throw error;
    }
};
