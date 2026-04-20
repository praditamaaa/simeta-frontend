import { api } from './apiService';

/**
 * Mentoring Service
 * Handles mentoring reports and mentee management.
 */

export interface MemorizationRecordDto {
    studentId: string;
    surahName: string;
    ayatStart: number;
    ayatEnd: number;
    fluency: number; // 0-100
}

export interface CreateMentoringReportDto {
    groupId: string;
    date: string; // ISO Date string
    notes: string;
    memorizationRecords: MemorizationRecordDto[];
}

export interface Mentee {
    id: string;
    name: string;
    email: string;
    // Add other fields as needed based on common user object
}

export const mentoringService = {
    /**
     * MENTOR/DOSEN: Create a mentoring report including memorization records.
     */
    createReport: async (data: CreateMentoringReportDto): Promise<any> => {
        const response = await api.post('/mentoring/report', data);
        return response.data;
    },

    /**
     * MENTOR/DOSEN: View list of assigned mentees.
     */
    getMyMentees: async (): Promise<Mentee[]> => {
        const response = await api.get<Mentee[]>('/mentoring/mentees');
        return response.data;
    }
};
