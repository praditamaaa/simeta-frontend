import { api } from './apiService';

/**
 * Permission Service
 * Handles leave/permission requests.
 */

export interface CreatePermissionDto {
    reason: string;
    sessionId?: string;
    proofUrl?: string;
}

export interface Permission {
    id: string;
    userId: string;
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    sessionId?: string;
    proofUrl?: string;
    createdAt: string;
}

export const permissionService = {
    /**
     * USER: Submit a permission/leave request (auto-approve if quota available).
     */
    create: async (data: CreatePermissionDto): Promise<void> => {
        await api.post('/permission', data);
    },

    /**
     * ADMIN: Retrieve all permission requests with optional status filter.
     */
    findAll: async (status?: string): Promise<Permission[]> => {
        const response = await api.get<Permission[]>('/permission', {
            params: { status }
        });
        return response.data;
    },

    /**
     * USER: View own permission requests.
     */
    getMyPermissions: async (): Promise<Permission[]> => {
        const response = await api.get<Permission[]>('/permission/my');
        return response.data;
    },

    /**
     * ADMIN: Approve all pending permission requests.
     */
    approveAll: async (): Promise<void> => {
        await api.patch('/permission/approve-all');
    },

    /**
     * ADMIN: Reject all pending permission requests.
     */
    rejectAll: async (): Promise<void> => {
        await api.patch('/permission/reject-all');
    },

    /**
     * ADMIN: Retrieve a specific permission request.
     */
    findOne: async (id: string): Promise<Permission> => {
        const response = await api.get<Permission>(`/permission/${id}`);
        return response.data;
    },

    /**
     * ADMIN: Approve a specific permission request.
     */
    approveOne: async (id: string): Promise<void> => {
        await api.patch(`/permission/${id}/approve`);
    },

    /**
     * ADMIN: Reject a specific permission request.
     */
    rejectOne: async (id: string): Promise<void> => {
        await api.patch(`/permission/${id}/reject`);
    }
};
