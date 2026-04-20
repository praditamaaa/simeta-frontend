import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../data/authStore';
import { theme } from '../theme/theme';

interface MenuItem {
    id: string;
    title: string;
    icon: string;
    route: string;
    roles?: string[]; // undefined = all roles
}

const ALL_MENU_ITEMS: MenuItem[] = [
    {
        id: 'absen',
        title: 'Absensi',
        icon: 'calendar-outline',
        route: '/(main)/absen',
        roles: ['MAHASISWA', 'MENTOR'],
    },
    {
        id: 'list-mentee',
        title: 'Absensi Mentee',
        icon: 'people-outline',
        route: '/(main)/list-mentee',
        roles: ['MENTOR', 'DOSEN'],
    },
    {
        id: 'resume',
        title: 'Resume',
        icon: 'document-text-outline',
        route: '/(main)/resume',
        roles: ['MAHASISWA', 'MENTOR'],
    },
    {
        id: 'matsurat',
        title: 'Al-Matsurat',
        icon: 'book-outline',
        route: '/(main)/matsurat',
    },
    {
        id: 'progress',
        title: 'Tilawah',
        icon: 'bookmark-outline',
        route: '/(main)/progress-peserta',
        roles: ['MAHASISWA', 'MENTOR'],
    },
    {
        id: 'progress-mentor',
        title: 'Progress Mentee',
        icon: 'stats-chart-outline',
        route: '/(main)/list-mentee',
        roles: ['MENTOR', 'DOSEN'],
    },
    {
        id: 'test',
        title: 'Kuis & Test',
        icon: 'clipboard-outline',
        route: '/(main)/test',
        roles: ['MAHASISWA', 'MENTOR'],
    },
    {
        id: 'izin',
        title: 'Pengajuan Izin',
        icon: 'mail-outline',
        route: '/(main)/izin',
        roles: ['MAHASISWA', 'MENTOR'],
    },
    {
        id: 'activity',
        title: 'Activity',
        icon: 'calendar-number-outline',
        route: '/(main)/activity',
    },
];

const getTodayLabel = (): string => {
    return new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const HomeScreen = () => {
    const { user, role } = useAuthStore();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const visibleMenuItems = ALL_MENU_ITEMS.filter(
        (item) => !item.roles || item.roles.includes(role ?? '')
    );

    const handleMenuPress = (item: MenuItem) => {
        router.push(item.route as any);
    };

    return (
        <SafeAreaView style={[styles.container, { paddingTop: insets.top > 0 ? 0 : 16 }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileInfo}>
                    <Text style={styles.greetingHeader}>Assalamu'alaikum,</Text>
                    <Text style={styles.userName} numberOfLines={1}>
                        {user?.name || 'Pengguna'}
                    </Text>
                    <Text style={styles.dateText}>{getTodayLabel()}</Text>
                </View>
                <View style={styles.headerDecoration}>
                    <View style={styles.circleDecor} />
                </View>
            </View>

            {/* Menu Grid */}
            <ScrollView
                contentContainerStyle={[styles.menuContent, { paddingBottom: 90 }]}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.menuTitle}>Menu</Text>

                <View style={styles.menuGrid}>
                    {visibleMenuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuCard}
                            onPress={() => handleMenuPress(item)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={36}
                                    color={theme.colors.text.primary}
                                />
                            </View>
                            <Text style={styles.menuItemTitle}>{item.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: theme.colors.primary,
        height: 200,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        padding: theme.spacing.lg,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    profileInfo: {
        zIndex: 2,
        justifyContent: 'center',
        flex: 1,
    },
    greetingHeader: {
        ...theme.typography.body,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
    },
    userName: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        marginVertical: 2,
    },
    dateText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginTop: 4,
    },
    headerDecoration: {
        position: 'absolute',
        right: -50,
        top: 20,
    },
    circleDecor: {
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    menuContent: {
        padding: theme.spacing.lg,
    },
    menuTitle: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
    },
    menuCard: {
        backgroundColor: theme.colors.secondary,
        width: '47%',
        minHeight: 120,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        justifyContent: 'space-between',
    },
    iconContainer: {
        marginBottom: theme.spacing.sm,
    },
    menuItemTitle: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.text.primary,
        fontSize: 15,
    },
});
