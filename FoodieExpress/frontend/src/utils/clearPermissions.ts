import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper script to clear permission flags for testing
 * Run this in your app to reset permissions and see the modals again
 */

export async function clearPermissionFlags() {
    try {
        await AsyncStorage.removeItem('@initial_permissions_shown');
        console.log('✅ Permission flags cleared! Reload app to see modals.');
        return true;
    } catch (error) {
        console.error('❌ Error clearing permission flags:', error);
        return false;
    }
}

// For easy testing in React Native DevTools console
if (__DEV__) {
    global.clearPermissionFlags = clearPermissionFlags;
}
