import { useState, useCallback } from 'react';
import * as MediaLibrary from 'expo-media-library';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type PermissionType = 'gallery' | 'contacts';
export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

const STORAGE_KEYS = {
    INITIAL_PERMISSIONS_SHOWN: '@initial_permissions_shown',
};

interface PermissionConfig {
    title: string;
    description: string;
    icon: string;
}

const PERMISSION_CONFIGS: Record<PermissionType, PermissionConfig> = {
    gallery: {
        title: 'Gallery Access',
        description: 'Allow Feedo to access your photos so you can upload profile pictures and share food photos.',
        icon: '📷'
    },
    contacts: {
        title: 'Contacts Access',
        description: 'Allow Feedo to access your contacts so you can easily invite friends to join.',
        icon: '👥'
    }
};

export function usePermissions() {
    const [permissionStatuses, setPermissionStatuses] = useState<Record<PermissionType, PermissionStatus>>({
        gallery: 'undetermined',
        contacts: 'undetermined'
    });

    const checkPermissionStatus = useCallback(async (type: PermissionType): Promise<PermissionStatus> => {
        try {
            let status: PermissionStatus = 'undetermined';
            if (type === 'gallery') {
                const result = await MediaLibrary.getPermissionsAsync();
                status = result.granted ? 'granted' : (result.canAskAgain ? 'undetermined' : 'denied');
            } else if (type === 'contacts') {
                const result = await Contacts.getPermissionsAsync();
                status = result.granted ? 'granted' : (result.canAskAgain ? 'undetermined' : 'denied');
            }

            setPermissionStatuses(prev => ({ ...prev, [type]: status }));
            return status;
        } catch (error) {
            console.error(`Error checking ${type} permission:`, error);
            return 'denied';
        }
    }, []);

    const requestPermission = useCallback(async (type: PermissionType): Promise<boolean> => {
        try {
            let granted = false;

            if (type === 'gallery') {
                const result = await MediaLibrary.requestPermissionsAsync();
                granted = result.granted;
            } else if (type === 'contacts') {
                const result = await Contacts.requestPermissionsAsync();
                granted = result.granted;
            }

            const newStatus: PermissionStatus = granted ? 'granted' : 'denied';
            setPermissionStatuses(prev => ({ ...prev, [type]: newStatus }));

            return granted;
        } catch (error) {
            console.error(`Error requesting ${type} permission:`, error);
            setPermissionStatuses(prev => ({ ...prev, [type]: 'denied' }));
            return false;
        }
    }, []);

    const checkInitialPermissionsShown = useCallback(async (): Promise<boolean> => {
        try {
            const shown = await AsyncStorage.getItem(STORAGE_KEYS.INITIAL_PERMISSIONS_SHOWN);
            return shown === 'true';
        } catch (error) {
            console.error('Error checking initial permissions shown:', error);
            return false;
        }
    }, []);

    const markInitialPermissionsShown = useCallback(async (): Promise<void> => {
        try {
            await AsyncStorage.setItem(STORAGE_KEYS.INITIAL_PERMISSIONS_SHOWN, 'true');
        } catch (error) {
            console.error('Error marking initial permissions shown:', error);
        }
    }, []);

    const getPermissionConfig = useCallback((type: PermissionType): PermissionConfig => {
        return PERMISSION_CONFIGS[type];
    }, []);

    return {
        permissionStatuses,
        checkPermissionStatus,
        requestPermission,
        checkInitialPermissionsShown,
        markInitialPermissionsShown,
        getPermissionConfig
    };
}
