import { api } from './apiService';

/**
 * User Service (Admin Only)
 * Handles user management operations.
 */

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'ADMIN' | 'DOSEN' | 'MENTOR' | 'MAHASISWA';
    deviceId?: string | null;
}

export interface AssignRoleDto {
    role: 'ADMIN' | 'DOSEN' | 'MENTOR' | 'MAHASISWA';
}

export const userService = {
    /**
     * ADMIN: Retrieve all registered users.
     */
    findAll: async (): Promise<User[]> => {
        const response = await api.get<User[]>('/users');
        return response.data;
    },

    /**
     * ADMIN: Retrieve a specific user's details.
     */
    findOne: async (id: string): Promise<User> => {
        const response = await api.get<User>(`/users/${id}`);
        return response.data;
    },

    /**
     * ADMIN: Delete a user account.
     */
    remove: async (id: string): Promise<void> => {
        await api.delete(`/users/${id}`);
    },

    /**
     * ADMIN: Assign a role to a user.
     */
    assignRole: async (id: string, data: AssignRoleDto): Promise<void> => {
        await api.patch(`/users/${id}/role`, data);
    },

    /**
     * ADMIN: Reset device binding for a user.
     */
    resetDevice: async (id: string): Promise<void> => {
        await api.patch(`/users/${id}/reset-device`);
    }
};
