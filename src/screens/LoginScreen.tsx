import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as z from 'zod';
import { Button } from '../../components/ui/button';
import { TextField } from '../../components/ui/textField';
import { authService } from '../api/authService';
import { useAuthStore } from '../data/authStore';
import { theme } from '../theme/theme';

const loginSchema = z.object({
    email: z.string().email('Email tidak valid'),
    password: z.string().min(1, 'Password harus diisi'),
});

type LoginForm = z.infer<typeof loginSchema>;

export const LoginScreen = () => {
    const { login, deviceId } = useAuthStore();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        if (!deviceId) {
            Alert.alert('Error', 'Device ID tidak ditemukan. Pastikan aplikasi memiliki izin yang diperlukan.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.login({
                email: data.email,
                password: data.password,
                deviceId: deviceId,
            });

            login({
                user: response.user,
                role: response.user.role,
                accessToken: response.accessToken,
            });

            router.replace('/(main)/home');
        } catch (error: any) {
            console.error('Login error full:', error);
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Response Status:', error.response.status);
                console.error('Response Data:', error.response.data);
                Alert.alert('Login Gagal', error.response.data?.message || `Error: ${error.response.status}`);
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Request details:', error.request);
                Alert.alert('Koneksi Gagal', 'Tidak dapat terhubung ke server. Pastikan server aktif dan internet stabil.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setup:', error.message);
                Alert.alert('Error', error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
        >
            <View style={styles.content}>
                {/* Branding Logo & Title */}
                <View style={styles.branding}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>M</Text>
                    </View>
                    <Text style={styles.welcomeText}>Selamat Datang di</Text>
                    <Text style={styles.appTitle}>SIMETA APP</Text>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Email"
                                placeholder="Masukkan email"
                                value={value}
                                onChangeText={onChange}
                                error={errors.email?.message}
                                autoCapitalize="none"
                                editable={!isLoading}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Password"
                                placeholder="Masukkan password"
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                                secureTextEntry
                                editable={!isLoading}
                            />
                        )}
                    />

                    <Button
                        title="Masuk"
                        onPress={handleSubmit(onSubmit)}
                        variant="ghost"
                        loading={isLoading}
                        textStyle={{ color: theme.colors.primary }}
                        style={styles.loginButton}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/(auth)/register')}
                    disabled={isLoading}
                >
                    <Text style={styles.footerText}>Atau Masuk Melalui Google</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    branding: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    logoPlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: theme.colors.secondary,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    logoText: {
        ...theme.typography.h1,
        fontSize: 40,
        color: theme.colors.primary,
    },
    welcomeText: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.secondary,
    },
    appTitle: {
        ...theme.typography.h1,
        fontSize: 36,
        color: theme.colors.text.primary,
    },
    card: {
        backgroundColor: theme.colors.secondary,
        width: '100%',
        borderRadius: 40,
        padding: theme.spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 5,
    },
    loginButton: {
        backgroundColor: 'transparent',
        marginTop: theme.spacing.sm,
    },
    footerText: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        marginTop: theme.spacing.xl,
        opacity: 0.8,
    }
});
