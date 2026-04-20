import axios from 'axios';
import { useAuthStore } from '../data/authStore';

// Change this to your actual production/staging URL
const BASE_URL = 'http://104.197.188.215:3000/api/v1';

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const { accessToken, deviceId } = useAuthStore.getState();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Requirement 2: Device ID must be sent
        if (deviceId) {
            config.headers['X-Device-ID'] = deviceId;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const { logout } = useAuthStore.getState();

        // Requirement 4: Auto logout on 401
        if (error.response?.status === 401) {
            logout();
        }

        // Requirement 2: Handle device mismatch error
        // Assuming backend returns 403 or custom code for device mismatch
        if (error.response?.status === 403 && error.response?.data?.code === 'DEVICE_MISMATCH') {
            // This could trigger a specific UI redirect or global state update
            console.error('Device Mismatch detected');
        }

        return Promise.reject(error);
    }
);
