import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
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

const formatDate = (dateStr: string): string => {
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

export const DetailNewsScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { newsId } = useLocalSearchParams<{ newsId: string }>();
    const [news, setNews] = useState<News | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            if (!newsId) return;
            try {
                const data = await newsService.findOne(newsId);
                setNews(data);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Gagal memuat detail berita.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchNews();
    }, [newsId]);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detail Berita</Text>
                <View style={styles.headerSpacer} />
            </View>

            {isLoading ? (
                <View style={styles.centerState}>
                    <ActivityIndicator size="large" color={theme.colors.secondary} />
                    <Text style={styles.stateText}>Memuat berita...</Text>
                </View>
            ) : error ? (
                <View style={styles.centerState}>
                    <Ionicons name="cloud-offline-outline" size={60} color={theme.colors.text.secondary} />
                    <Text style={styles.stateText}>{error}</Text>
                </View>
            ) : news ? (
                <ScrollView
                    contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Image */}
                    {news.imageUrl ? (
                        <Image
                            source={{ uri: news.imageUrl }}
                            style={styles.heroImage}
                            resizeMode="cover"
                        />
                    ) : (
                        <View style={styles.heroImagePlaceholder}>
                            <Ionicons name="newspaper-outline" size={60} color="rgba(255,255,255,0.4)" />
                        </View>
                    )}

                    <View style={styles.articleContent}>
                        {/* Title */}
                        <Text style={styles.articleTitle}>{news.title}</Text>

                        {/* Date */}
                        <View style={styles.metaRow}>
                            <Ionicons name="calendar-outline" size={14} color={theme.colors.secondary} />
                            <Text style={styles.articleDate}>
                                Diterbitkan: {formatDate(news.createdAt)}
                            </Text>
                        </View>

                        <View style={styles.divider} />

                        {/* Body */}
                        <Text style={styles.articleBody}>{news.content}</Text>
                    </View>
                </ScrollView>
            ) : null}
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
    headerSpacer: {
        width: 44,
    },
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
    heroImagePlaceholder: {
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
    articleTitle: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
        fontSize: 22,
        lineHeight: 30,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: theme.spacing.md,
    },
    articleDate: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.medium,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginBottom: theme.spacing.md,
    },
    articleBody: {
        ...theme.typography.body,
        color: '#374151',
        lineHeight: 26,
    },
});
