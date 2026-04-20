import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Activity } from './ActivityScreen';
import { theme } from '../theme/theme';

const formatDateTime = (dateStr: string, timeStr?: string): string => {
    try {
        const date = new Date(dateStr);
        const dayStr = date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
        return timeStr ? `${dayStr} pukul ${timeStr}` : dayStr;
    } catch {
        return dateStr;
    }
};

const getStatusStyle = (status: Activity['status']) => {
    switch (status) {
        case 'UPCOMING':
            return { bg: '#EFF6FF', text: '#1D4ED8', label: 'Akan Datang' };
        case 'ONGOING':
            return { bg: '#ECFDF5', text: '#065F46', label: 'Sedang Berlangsung' };
        case 'DONE':
            return { bg: '#F3F4F6', text: '#374151', label: 'Selesai' };
        default:
            return null;
    }
};

export const DetailActivityScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { activityData } = useLocalSearchParams<{ activityData: string }>();

    const activity: Activity | null = activityData ? JSON.parse(activityData) : null;
    const statusStyle = activity?.status ? getStatusStyle(activity.status) : null;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Kegiatan</Text>
                <View style={styles.headerSpacer} />
            </View>

            {!activity ? (
                <View style={styles.centerState}>
                    <Ionicons name="alert-circle-outline" size={60} color={theme.colors.text.secondary} />
                    <Text style={styles.stateText}>Data kegiatan tidak ditemukan.</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Banner */}
                    {activity.imageUrl ? (
                        <Image
                            source={{ uri: activity.imageUrl }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.heroPlaceholder}>
                            <Ionicons name="calendar-outline" size={60} color="rgba(255,255,255,0.3)" />
                        </View>
                    )}

                    <View style={styles.articleContent}>
                        {/* Status badge */}
                        {statusStyle && (
                            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                    {statusStyle.label}
                                </Text>
                            </View>
                        )}

                        {/* Name */}
                        <Text style={styles.activityName}>{activity.name}</Text>

                        {/* Date & Time */}
                        <View style={styles.infoRow}>
                            <Ionicons name="calendar-outline" size={18} color={theme.colors.secondary} />
                            <Text style={styles.infoText}>
                                {formatDateTime(activity.date, activity.time)}
                            </Text>
                        </View>

                        {/* Location */}
                        {activity.location && (
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={18} color={theme.colors.secondary} />
                                <Text style={styles.infoText}>{activity.location}</Text>
                            </View>
                        )}

                        <View style={styles.divider} />

                        {/* Description */}
                        {activity.description && (
                            <>
                                <Text style={styles.sectionLabel}>Deskripsi Kegiatan</Text>
                                <Text style={styles.descriptionText}>{activity.description}</Text>
                            </>
                        )}

                        {/* Contact */}
                        {activity.contact && (
                            <>
                                <View style={styles.divider} />
                                <Text style={styles.sectionLabel}>Narahubung</Text>
                                <Text style={styles.descriptionText}>{activity.contact}</Text>
                            </>
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.primary,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: { width: 44 },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    stateText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
    },
    scrollContent: {
        flexGrow: 1,
    },
    heroImage: {
        width: '100%',
        height: 220,
    },
    heroPlaceholder: {
        width: '100%',
        height: 160,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    articleContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        flex: 1,
        padding: theme.spacing.lg,
        marginTop: -20,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: 4,
        borderRadius: theme.roundness.full,
        marginBottom: theme.spacing.md,
    },
    statusText: {
        ...theme.typography.caption,
        fontFamily: theme.fonts.semiBold,
    },
    activityName: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        fontSize: 22,
        lineHeight: 30,
        marginBottom: theme.spacing.md,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: theme.spacing.sm,
    },
    infoText: {
        ...theme.typography.body,
        color: '#374151',
        flex: 1,
        lineHeight: 22,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: theme.spacing.md,
    },
    sectionLabel: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    descriptionText: {
        ...theme.typography.body,
        color: '#374151',
        lineHeight: 26,
    },
});
