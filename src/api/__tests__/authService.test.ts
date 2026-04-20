import { authService } from '../authService';
import { api } from '../apiService';
import MockAdapter from 'axios-mock-adapter';

// This file serves as an example for testing your API services.
// To run this test, you will need to set up Jest and axios-mock-adapter.

const mock = new MockAdapter(api);

describe('authService Unit Tests', () => {
    afterEach(() => {
        mock.reset();
    });

    it('should authenticate user and return data on successful login', async () => {
        const loginData = {
            email: 'user@example.com',
            password: 'securepassword',
            deviceId: 'mobile-123'
        };

        const mockResponse = {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            user: {
                id: '101',
                name: 'John Doe',
                email: 'user@example.com',
                role: 'MAHASISWA'
            }
        };

        mock.onPost('/auth/login').reply(200, mockResponse);

        const result = await authService.login(loginData);

        expect(result.accessToken).toBe(mockResponse.accessToken);
        expect(result.user.name).toBe('John Doe');
        expect(result.user.role).toBe('MAHASISWA');
    });

    it('should throw an error when login fails', async () => {
        const loginData = {
            email: 'wrong@example.com',
            password: 'wrong',
            deviceId: 'mobile-123'
        };

        mock.onPost('/auth/login').reply(401, { message: 'Invalid credentials' });

        await expect(authService.login(loginData)).rejects.toThrow();
    });

    it('should register a new user successfully', async () => {
        const registerData = {
            name: 'New User',
            email: 'new@example.com',
            password: 'password123'
        };

        mock.onPost('/auth/register').reply(201);

        await expect(authService.register(registerData)).resolves.not.toThrow();
    });
});
