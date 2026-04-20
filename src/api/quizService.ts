import { api } from './apiService';

/**
 * Quiz Service
 * Handles quiz creation, submission, and result retrieval.
 */

export interface Question {
    id: string;
    text: string;
    options: string[];
}

export interface CreateQuestionDto {
    text: string;
    options: string[];
    correctIdx: number;
}

export interface CreateQuizDto {
    title: string;
    type: 'PRETEST' | 'POSTTEST';
    questions: CreateQuestionDto[];
}

export interface AnswerDto {
    questionId: string;
    selectedIdx: number;
}

export interface SubmitQuizDto {
    answers: AnswerDto[];
}

export interface Quiz {
    id: string;
    title: string;
    type: 'PRETEST' | 'POSTTEST';
}

export interface QuizResult {
    id: string;
    userId: string;
    quizId: string;
    score: number;
    submittedAt: string;
}

export const quizService = {
    /**
     * ADMIN/DOSEN: Create a new quiz with questions.
     */
    create: async (data: CreateQuizDto): Promise<any> => {
        const response = await api.post('/quiz', data);
        return response.data;
    },

    /**
     * ALL (authenticated): Retrieve list of available quizzes.
     */
    findAll: async (): Promise<Quiz[]> => {
        const response = await api.get<Quiz[]>('/quiz');
        return response.data;
    },

    /**
     * USER: View own quiz results and scores.
     */
    getMyResults: async (): Promise<QuizResult[]> => {
        const response = await api.get<QuizResult[]>('/quiz/my-results');
        return response.data;
    },

    /**
     * USER: Start a quiz and get questions (without answers).
     */
    startQuiz: async (id: string): Promise<{ id: string; title: string, questions: Question[] }> => {
        const response = await api.get(`/quiz/${id}/start`);
        return response.data;
    },

    /**
     * USER: Submit answers for a quiz and get score.
     */
    submitQuiz: async (id: string, data: SubmitQuizDto): Promise<any> => {
        const response = await api.post(`/quiz/${id}/submit`, data);
        return response.data;
    },

    /**
     * ADMIN/DOSEN: View all results for a specific quiz.
     */
    getResults: async (id: string): Promise<QuizResult[]> => {
        const response = await api.get<QuizResult[]>(`/quiz/${id}/results`);
        return response.data;
    }
};
