import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { News, newsService } from '../api/newsService';
import { theme } from '../theme/theme';

const formatDate = (dateStr: string): string => {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

export const NewsScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [newsList, setNewsList] = useState<News[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNews = async () => {
        try {
            setError(null);
            const data = await newsService.findAll();
            setNewsList(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat berita.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchNews();
    };

    const handleNewsPress = (news: News) => {
        router.push({
            pathname: '/(main)/news-detail',
            params: { newsId: news.id },
        });
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Berita & Informasi</Text>
                <Text style={styles.headerSubtitle}>Update terbaru seputar Metagama</Text>
            </View>

            {/* Content */}
            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
                {isLoading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={styles.stateText}>Memuat berita...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.centerState}>
                        <Ionicons name="cloud-offline-outline" size={60} color={theme.colors.text.secondary} />
                        <Text style={styles.stateText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
                            <Text style={styles.retryText}>Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                        refreshControl={
                            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
                        }
                    >
                        {newsList.length === 0 ? (
                            <View style={styles.centerState}>
                                <Ionicons name="newspaper-outline" size={60} color={theme.colors.text.secondary} />
                                <Text style={styles.stateText}>Belum ada berita tersedia.</Text>
                            </View>
                        ) : (
                            newsList.map((news) => (
                                <TouchableOpacity
                                    key={news.id}
                                    style={styles.newsCard}
                                    onPress={() => handleNewsPress(news)}
                                    activeOpacity={0.85}
                                >
                                    {news.imageUrl ? (
                                        <Image
                                            source={{ uri: news.imageUrl }}
                                            style={styles.thumbnail}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.thumbnailPlaceholder}>
                                            <Ionicons name="newspaper-outline" size={32} color={theme.colors.text.primary} />
                                        </View>
                                    )}
                                    <View style={styles.newsInfo}>
                                        <Text style={styles.newsTitle} numberOfLines={2}>
                                            {news.title}
                                        </Text>
                                        <Text style={styles.newsDate}>{formatDate(news.createdAt)}</Text>
                                        <Text style={styles.newsSummary} numberOfLines={2}>
                                            {news.content}
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
                                </TouchableOpacity>
                            ))
                        )}
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
        paddingVertical: theme.spacing.xl,
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
    },
    headerSubtitle: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        marginTop: 4,
    },
    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    scrollContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.lg,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        gap: 12,
    },
    stateText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.roundness.xl,
    },
    retryText: {
        ...theme.typography.bodySemiBold,
        color: '#FFFFFF',
    },
    newsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    thumbnail: {
        width: 72,
        height: 72,
        borderRadius: theme.roundness.md,
        marginRight: theme.spacing.md,
        backgroundColor: '#E5E7EB',
    },
    thumbnailPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: theme.roundness.md,
        marginRight: theme.spacing.md,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsInfo: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    newsTitle: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        marginBottom: 4,
        fontSize: 15,
    },
    newsDate: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        marginBottom: 4,
    },
    newsSummary: {
        ...theme.typography.caption,
        color: '#6B7280',
        lineHeight: 18,
    },
});
