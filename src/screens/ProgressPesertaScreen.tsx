import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

// Local type — will be replaced by API type once backend endpoint is available
interface MentoringSession {
    id: string;
    date: string;
    ayatStart: number;
    ayatEnd: number;
    attendanceStatus: 'HADIR' | 'TERLAMBAT' | 'ALPHA';
    mentorNote?: string;
}

const TOTAL_AYAT = 49;

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

const getStatusStyle = (status: MentoringSession['attendanceStatus']) => {
    switch (status) {
        case 'HADIR':
            return { bg: '#D1FAE5', text: '#065F46' };
        case 'TERLAMBAT':
            return { bg: '#FEF3C7', text: '#92400E' };
        case 'ALPHA':
            return { bg: '#FEE2E2', text: '#991B1B' };
    }
};

const getStatusLabel = (status: MentoringSession['attendanceStatus']) => {
    switch (status) {
        case 'HADIR': return 'Hadir';
        case 'TERLAMBAT': return 'Terlambat';
        case 'ALPHA': return 'Alpha';
    }
};

// Data akan terisi dari backend setelah endpoint /mentoring/my-progress tersedia
const sessions: MentoringSession[] = [];

export const ProgressPesertaScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const totalAyat = sessions.reduce((sum, s) => {
        const count = s.ayatEnd - s.ayatStart + 1;
        return sum + (count > 0 ? count : 0);
    }, 0);

    const progressPercent = Math.min((totalAyat / TOTAL_AYAT) * 100, 100);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Progress Hafalan Saya</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Progress Summary Card */}
                <View style={styles.summaryCard}>
                    <Text style={styles.surahName}>Surah Al-Hujurat (49 Ayat)</Text>
                    <Text style={styles.totalHafal}>Total Hafal: {totalAyat} Ayat</Text>

                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
                    </View>

                    <View style={styles.progressLabelRow}>
                        <Text style={styles.progressLabel}>0</Text>
                        <Text style={styles.progressPercent}>{progressPercent.toFixed(0)}%</Text>
                        <Text style={styles.progressLabel}>{TOTAL_AYAT}</Text>
                    </View>
                </View>

                {/* Session History */}
                <Text style={styles.sectionTitle}>Riwayat Setoran</Text>

                {sessions.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="book-outline" size={48} color={theme.colors.text.secondary} />
                        <Text style={styles.emptyText}>Belum ada riwayat hafalan.</Text>
                        <Text style={styles.emptySubText}>
                            Data akan muncul setelah mentor mencatat setoran Anda.
                        </Text>
                    </View>
                ) : (
                    sessions.map((session, index) => {
                        const statusStyle = getStatusStyle(session.attendanceStatus);
                        const ayatCount = session.ayatEnd - session.ayatStart + 1;
                        return (
                            <View key={session.id || index} style={styles.sessionCard}>
                                <View style={styles.sessionHeader}>
                                    <View style={styles.sessionNumberBadge}>
                                        <Text style={styles.sessionNumberText}>Sesi {sessions.length - index}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>
                                            {getStatusLabel(session.attendanceStatus)}
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.sessionDate}>{formatDate(session.date)}</Text>

                                <View style={styles.ayatRow}>
                                    <Ionicons name="bookmark-outline" size={16} color={theme.colors.secondary} />
                                    <Text style={styles.ayatText}>
                                        Ayat {session.ayatStart} – Ayat {session.ayatEnd}
                                        {'  '}
                                        <Text style={styles.ayatCount}>({ayatCount} ayat)</Text>
                                    </Text>
                                </View>

                                <View style={styles.catatanContainer}>
                                    <Text style={styles.catatanLabel}>Catatan Mentor:</Text>
                                    <Text style={styles.catatanText}>
                                        {session.mentorNote || 'Tidak ada catatan.'}
                                    </Text>
                                </View>
                            </View>
                        );
                    })
                )}
            </ScrollView>
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
    scrollContent: {
        padding: theme.spacing.lg,
    },
    summaryCard: {
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
    },
    surahName: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    totalHafal: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
    },
    progressBarBg: {
        height: 12,
        backgroundColor: 'rgba(13,17,49,0.2)',
        borderRadius: theme.roundness.full,
        overflow: 'hidden',
        marginBottom: 6,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.full,
    },
    progressLabelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    progressLabel: {
        ...theme.typography.caption,
        color: theme.colors.primary,
    },
    progressPercent: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    },
    sectionTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        marginBottom: theme.spacing.md,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xxl,
        gap: 8,
    },
    emptyText: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.text.secondary,
    },
    emptySubText: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        textAlign: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    sessionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    sessionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    sessionNumberBadge: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.roundness.sm,
    },
    sessionNumberText: {
        ...theme.typography.caption,
        color: '#FFFFFF',
        fontFamily: theme.fonts.semiBold,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.roundness.full,
    },
    statusText: {
        ...theme.typography.caption,
        fontFamily: theme.fonts.semiBold,
    },
    sessionDate: {
        ...theme.typography.caption,
        color: '#6B7280',
        marginBottom: theme.spacing.sm,
    },
    ayatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: theme.spacing.sm,
    },
    ayatText: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        fontSize: 15,
    },
    ayatCount: {
        fontFamily: theme.fonts.regular,
        color: '#6B7280',
        fontSize: 13,
    },
    catatanContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: theme.roundness.md,
        padding: theme.spacing.sm,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.secondary,
    },
    catatanLabel: {
        ...theme.typography.caption,
        color: '#6B7280',
        fontFamily: theme.fonts.semiBold,
        marginBottom: 2,
    },
    catatanText: {
        ...theme.typography.caption,
        color: '#374151',
        lineHeight: 18,
    },
});
