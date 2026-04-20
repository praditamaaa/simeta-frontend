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
import { theme } from '../theme/theme';

const registerSchema = z.object({
    name: z.string().min(1, 'Nama harus diisi'),
    email: z.string().email('Email tidak valid'),
    password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export const RegisterScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setIsLoading(true);
        try {
            await authService.register({
                name: data.name,
                email: data.email,
                password: data.password,
            });
            Alert.alert('Sukses', 'Registrasi berhasil, silakan login', [
                { text: 'OK', onPress: () => router.replace('/(auth)/login') }
            ]);
        } catch (error: any) {
            console.error('Registration error:', error);
            Alert.alert('Registrasi Gagal', error.response?.data?.message || 'Terjadi kesalahan saat mendaftar');
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
                <View style={styles.branding}>
                    <View style={styles.logoPlaceholder}>
                        <Text style={styles.logoText}>M</Text>
                    </View>
                    <Text style={styles.welcomeText}>Selamat Datang di</Text>
                    <Text style={styles.appTitle}>SIMETA APP</Text>
                </View>

                <View style={styles.card}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <TextField
                                label="Nama"
                                placeholder="Masukkan nama"
                                value={value}
                                onChangeText={onChange}
                                error={errors.name?.message}
                                editable={!isLoading}
                            />
                        )}
                    />

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
                        title="Daftar"
                        onPress={handleSubmit(onSubmit)}
                        variant="ghost"
                        loading={isLoading}
                        textStyle={{ color: theme.colors.primary }}
                        style={styles.registerButton}
                    />
                </View>

                <TouchableOpacity
                    onPress={() => router.push('/(auth)/login')}
                    disabled={isLoading}
                >
                    <Text style={styles.footerText}>Atau Daftar Melalui Google</Text>
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
        width: 80, // standardized with login
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
    },
    registerButton: {
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
