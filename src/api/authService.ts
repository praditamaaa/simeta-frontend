import { api } from './apiService';

/**
 * Authentication Service
 * Handles user registration and login based on the SIMETA API specification.
 */

export interface LoginDto {
    email: string;
    password: string;
    deviceId: string;
}

export interface RegisterDto {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: 'ADMIN' | 'DOSEN' | 'MENTOR' | 'MAHASISWA';
    };
}

export const authService = {
    /**
     * Authenticate user and return JWT token.
     * Requires deviceId for device binding.
     */
    login: async (data: LoginDto): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', data);
        return response.data;
    },

    /**
     * Register a new user account.
     */
    register: async (data: RegisterDto): Promise<void> => {
        await api.post('/auth/register', data);
    }
};
