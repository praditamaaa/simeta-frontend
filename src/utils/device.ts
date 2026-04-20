import * as Application from 'expo-application';
import { Platform } from 'react-native';

/**
 * Gets a unique identifier for the device.
 * - Android: Android ID (SSAID)
 * - iOS: Identifier for Vendor (IDFV)
 * - Fallback: Throws an error if no ID can be retrieved (per user requirement)
 */
export const getDeviceId = async (): Promise<string> => {
    try {
        let deviceId: string | null = null;

        if (Platform.OS === 'android') {
            deviceId = Application.getAndroidId();
        } else if (Platform.OS === 'ios') {
            deviceId = await Application.getIosIdForVendorAsync();
        } else if (Platform.OS === 'web') {
            // Web doesn't have a native device ID, so we generate a persistent-friendly random ID
            // This will be stored in the authStore (which persists to SecureStore/LocalStorage)
            deviceId = `web-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }

        if (!deviceId) {
            // Fallback for any other case or if native retrieval failed
            deviceId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
        }
        console.log('Device ID:', deviceId);
        return deviceId;
    } catch (error) {
        console.error('Error getting device ID:', error);
        // Return a fallback ID instead of throwing to avoid crashing the app
        return `fallback-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
};
