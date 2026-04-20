import { api } from './apiService';

/**
 * News Service
 * Handles news and announcements.
 */

export interface CreateNewsDto {
    title: string;
    content: string;
    imageUrl?: string;
}

export interface News {
    id: string;
    title: string;
    content: string;
    imageUrl?: string;
    authorId: string;
    createdAt: string;
}

export const newsService = {
    /**
     * ADMIN/DOSEN: Create a news article (triggers notification).
     */
    create: async (data: CreateNewsDto): Promise<void> => {
        await api.post('/news', data);
    },

    /**
     * PUBLIC: Retrieve all news articles.
     */
    findAll: async (): Promise<News[]> => {
        const response = await api.get<News[]>('/news');
        return response.data;
    },

    /**
     * PUBLIC: Retrieve a specific news article.
     */
    findOne: async (id: string): Promise<News> => {
        const response = await api.get<News>(`/news/${id}`);
        return response.data;
    },

    /**
     * ADMIN/DOSEN: Update a news article (triggers notification).
     */
    update: async (id: string, data: Partial<CreateNewsDto>): Promise<void> => {
        await api.patch(`/news/${id}`, data);
    },

    /**
     * ADMIN: Delete a news article.
     */
    remove: async (id: string): Promise<void> => {
        await api.delete(`/news/${id}`);
    }
};
