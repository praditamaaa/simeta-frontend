import { api } from './apiService';

/**
 * Notification Service
 * Handles user notifications.
 */

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
}

export const notificationService = {
    /**
     * USER: Retrieve all notifications for the authenticated user.
     */
    getMyNotifications: async (): Promise<Notification[]> => {
        const response = await api.get<Notification[]>('/notification');
        return response.data;
    },

    /**
     * USER: Get the number of unread notifications.
     */
    getUnreadCount: async (): Promise<{ count: number }> => {
        const response = await api.get('/notification/unread-count');
        return response.data;
    },

    /**
     * USER: Mark a specific notification as read.
     */
    markAsRead: async (id: string): Promise<any> => {
        const response = await api.patch(`/notification/${id}/read`);
        return response.data;
    },

    /**
     * USER: Mark all notifications as read.
     */
    markAllAsRead: async (): Promise<void> => {
        await api.patch('/notification/read-all');
    }
};
