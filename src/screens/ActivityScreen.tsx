import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { News, newsService } from '../api/newsService';
import { theme } from '../theme/theme';

export type Activity = News;

const formatDateTime = (dateStr: string): string => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export const ActivityScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivities = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await newsService.findAll();
            setActivities(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat kegiatan.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchActivities();
    }, []);

    const handlePress = (activity: Activity) => {
        router.push({
            pathname: '/(main)/activity-detail',
            params: { activityData: JSON.stringify(activity) },
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.headerTextGroup}>
                    <Text style={styles.headerTitle}>Kegiatan Metagama</Text>
                    <Text style={styles.headerSubtitle}>Jadwal & informasi rangkaian acara</Text>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.centerState}>
                        <Ionicons name="alert-circle-outline" size={60} color={theme.colors.status.error} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchActivities}>
                            <Text style={styles.retryText}>Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>
                ) : activities.length === 0 ? (
                    <View style={styles.centerState}>
                        <Ionicons name="calendar-outline" size={60} color={theme.colors.text.secondary} />
                        <Text style={styles.emptyText}>Belum ada kegiatan tersedia.</Text>
                    </View>
                ) : (
                    <ScrollView
                        style={{ flex: 1 }}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                    >
                        {activities.map((activity) => (
                            <TouchableOpacity
                                key={activity.id}
                                style={styles.activityCard}
                                onPress={() => handlePress(activity)}
                                activeOpacity={0.85}
                            >
                                {activity.imageUrl ? (
                                    <Image
                                        source={{ uri: activity.imageUrl }}
                                        style={styles.activityBanner}
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View style={styles.activityBannerPlaceholder}>
                                        <Ionicons name="calendar-outline" size={40} color="rgba(255,255,255,0.5)" />
                                    </View>
                                )}
                                <View style={styles.activityInfo}>
                                    <Text style={styles.activityName} numberOfLines={2}>
                                        {activity.title}
                                    </Text>
                                    <View style={styles.activityMeta}>
                                        <Ionicons name="calendar-outline" size={14} color={theme.colors.secondary} />
                                        <Text style={styles.activityDateTime}>
                                            {formatDateTime(activity.createdAt)}
                                        </Text>
                                    </View>
                                    <View style={styles.activityFooter}>
                                        <Ionicons name="chevron-forward-outline" size={18} color={theme.colors.secondary} />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                )}
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
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTextGroup: {
        flex: 1,
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginTop: 2,
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        marginBottom: theme.spacing.md,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    activityBanner: {
        width: '100%',
        height: 140,
    },
    activityBannerPlaceholder: {
        width: '100%',
        height: 120,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activityInfo: {
        padding: theme.spacing.md,
    },
    activityName: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontSize: 17,
        marginBottom: 6,
    },
    activityMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    activityDateTime: {
        ...theme.typography.caption,
        color: '#6B7280',
        fontFamily: theme.fonts.medium,
        flex: 1,
    },
    activityFooter: {
        alignItems: 'flex-end',
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 100,
    },
    errorText: {
        ...theme.typography.body,
        color: theme.colors.status.error,
        textAlign: 'center',
        marginTop: 12,
        paddingHorizontal: 20,
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginTop: 12,
    },
    retryButton: {
        marginTop: 16,
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: theme.roundness.md,
    },
    retryText: {
        ...theme.typography.button,
        color: '#FFFFFF',
    },
});
