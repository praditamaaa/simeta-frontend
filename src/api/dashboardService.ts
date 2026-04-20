import { api } from './apiService';

/**
 * Dashboard Service
 * Handles grading and dashboard data.
 */

export interface Grade {
    subject: string;
    score: number;
    grade: string;
}

export interface StudentGrades {
    id: string;
    name: string;
    grades: Grade[];
    overallAverage: number;
}

export const dashboardService = {
    /**
     * USER: View own grades and scores.
     */
    getMyGrades: async (): Promise<any> => {
        const response = await api.get('/dashboard/my-grades');
        return response.data;
    },

    /**
     * ADMIN: View ranking of all students.
     */
    getAllGrades: async (): Promise<StudentGrades[]> => {
        const response = await api.get<StudentGrades[]>('/dashboard/all-grades');
        return response.data;
    },

    /**
     * ADMIN: View grades for a specific student.
     */
    getStudentGrades: async (id: string): Promise<StudentGrades> => {
        const response = await api.get<StudentGrades>(`/dashboard/student/${id}`);
        return response.data;
    }
};
