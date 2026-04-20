import { api } from './apiService';

/**
 * Resume Service
 * Handles student resume management.
 */

export interface CreateResumeDto {
    content: string; // Min length 200
    fileUrl?: string;
}

export interface UpdateResumeDto {
    content?: string;
    fileUrl?: string;
}

export interface Resume {
    id: string;
    userId: string;
    content: string;
    fileUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export const resumeService = {
    /**
     * USER: Submit a new resume.
     */
    create: async (data: CreateResumeDto): Promise<void> => {
        await api.post('/resume', data);
    },

    /**
     * ADMIN: Retrieve all student resumes.
     */
    findAll: async (): Promise<Resume[]> => {
        const response = await api.get<Resume[]>('/resume');
        return response.data;
    },

    /**
     * USER: View own submitted resumes.
     */
    getMyResumes: async (): Promise<Resume[]> => {
        const response = await api.get<Resume[]>('/resume/my');
        return response.data;
    },

    /**
     * ALL (authenticated): Retrieve a specific resume.
     */
    findOne: async (id: string): Promise<Resume> => {
        const response = await api.get<Resume>(`/resume/${id}`);
        return response.data;
    },

    /**
     * USER: Update own resume.
     */
    update: async (id: string, data: UpdateResumeDto): Promise<void> => {
        await api.patch(`/resume/${id}`, data);
    },

    /**
     * USER: Delete own resume.
     */
    remove: async (id: string): Promise<void> => {
        await api.delete(`/resume/${id}`);
    }
};
