import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../data/authStore';
import { theme } from '../theme/theme';

export const ProfileScreen = () => {
    const { user, role, logout } = useAuthStore();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const profileData = [
        { label: 'Nama Lengkap', value: user?.name || 'Belum diatur' },
        { label: 'Email', value: user?.email || 'Belum diatur' },
        { label: 'Role / Status', value: role || 'PELAJAR' },
        { label: 'NIM', value: '-' }, // TODO: Fetch from profile API if available
        { label: 'Prodi', value: '-' }, // TODO: Fetch from profile API if available
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profil Saya</Text>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={100} color={theme.colors.secondary} />
                    </View>
                </View>

                <View style={styles.dataContainer}>
                    {profileData.map((item, index) => (
                        <View key={index} style={styles.dataRow}>
                            <Text style={styles.dataLabel}>{item.label}</Text>
                            <Text style={styles.dataValue}>{item.value}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={logout}
                >
                    <Text style={styles.logoutText}>KELUAR / LOGOUT</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    header: {
        padding: theme.spacing.xl,
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: theme.spacing.lg,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        marginTop: -10,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: theme.colors.secondary,
    },
    dataContainer: {
        marginBottom: theme.spacing.xl,
    },
    dataRow: {
        marginBottom: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        paddingBottom: theme.spacing.sm,
    },
    dataLabel: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        fontFamily: theme.fonts.semiBold,
        marginBottom: 4,
    },
    dataValue: {
        ...theme.typography.h3,
        color: theme.colors.primary,
    },
    logoutButton: {
        backgroundColor: theme.colors.status.error,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.roundness.xl,
        alignItems: 'center',
    },
    logoutText: {
        ...theme.typography.button,
        color: theme.colors.text.primary,
    },
});
