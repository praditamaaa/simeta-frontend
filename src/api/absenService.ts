import { api } from './apiService';

export interface AttendanceRecord {
    id: string;
    sessionId: string;
    userId: string;
    checkInTime: string; // ISO Date string
    latitude: number;
    longitude: number;
    status: 'PRESENT' | 'LATE' | 'PERMISSION' | 'ALPHA';
}

export interface CreateAttendanceDto {
    sessionId: string;
    latitude: number;
    longitude: number;
}

export interface CreateSessionDto {
    title: string;
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
}

export const attendanceService = {
    /**
     * USER: Check-in to an attendance session with GPS coordinates.
     */
    checkIn: async (data: CreateAttendanceDto): Promise<AttendanceRecord> => {
        const response = await api.post<AttendanceRecord>('/attendance/check-in', data);
        return response.data;
    },

    /**
     * ADMIN: Retrieve all attendance records.
     */
    findAll: async (): Promise<AttendanceRecord[]> => {
        const response = await api.get<AttendanceRecord[]>('/attendance');
        return response.data;
    },

    /**
     * ADMIN: Retrieve a specific attendance record.
     */
    findOne: async (id: string): Promise<AttendanceRecord> => {
        const response = await api.get<AttendanceRecord>(`/attendance/${id}`);
        return response.data;
    },

    /**
     * ADMIN: Create a new attendance session.
     */
    createSession: async (data: CreateSessionDto): Promise<any> => {
        const response = await api.post('/attendance/session', data);
        return response.data;
    }
};

// Alias for backward compatibility if any parts of the app still look for 'absenService'
export const absenService = {
    submitAbsen: (lat: number, lng: number, sessionId: string) => 
        attendanceService.checkIn({ latitude: lat, longitude: lng, sessionId }),
    getAbsenHistory: () => attendanceService.findAll()
};
