import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type UserRole = 'MENTOR' | 'MAHASISWA' | 'ADMIN' | 'DOSEN';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    role: UserRole | null;
    accessToken: string | null;
    deviceId: string | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
    setDeviceId: (id: string) => void;
    login: (data: { user: User; role: UserRole; accessToken: string }) => void;
    logout: () => void;
}

const secureStorage = {
    getItem: async (name: string): Promise<string | null> => {
        return await SecureStore.getItemAsync(name);
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await SecureStore.setItemAsync(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await SecureStore.deleteItemAsync(name);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            role: null,
            accessToken: null,
            deviceId: null,
            isAuthenticated: false,
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
            setDeviceId: (id) => set({ deviceId: id }),
            login: (data) =>
                set({
                    user: data.user,
                    role: data.role,
                    accessToken: data.accessToken,
                    isAuthenticated: true,
                }),
            logout: () =>
                set({
                    user: null,
                    role: null,
                    accessToken: null,
                    isAuthenticated: false,
                }),
        }),
        {
            name: 'simeta-auth-storage',
            storage: createJSONStorage(() => secureStorage),
            onRehydrateStorage: (state) => {
                return () => state?.setHasHydrated(true);
            },
        }
    )
);
