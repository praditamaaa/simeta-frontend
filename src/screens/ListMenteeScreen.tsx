import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Mentee, mentoringService } from '../api/mentoringService';
import { theme } from '../theme/theme';

export const ListMenteeScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [mentees, setMentees] = useState<Mentee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMentees = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await mentoringService.getMyMentees();
            setMentees(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat daftar mentee.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMentees();
    }, []);

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>List Mentee</Text>
                </View>
                <View style={styles.brandingHeader}>
                    <View style={styles.logoDecor} />
                </View>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
                <View style={styles.titleRow}>
                    <Text style={styles.appTitle}>SIMETA APP</Text>
                </View>

                {isLoading ? (
                    <View style={styles.centerState}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : error ? (
                    <View style={styles.centerState}>
                        <Ionicons name="alert-circle-outline" size={60} color={theme.colors.status.error} />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchMentees}>
                            <Text style={styles.retryText}>Coba Lagi</Text>
                        </TouchableOpacity>
                    </View>
                ) : mentees.length === 0 ? (
                    <View style={styles.centerState}>
                        <Ionicons name="people-outline" size={60} color={theme.colors.text.secondary} />
                        <Text style={styles.emptyText}>Belum ada mentee terdaftar.</Text>
                    </View>
                ) : (
                    <ScrollView 
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {mentees.map((mentee) => (
                            <TouchableOpacity
                                key={mentee.id}
                                style={styles.menteeCard}
                                onPress={() => router.push({
                                    pathname: '/(main)/absen-mentee',
                                    params: { menteeId: mentee.id, menteeName: mentee.name }
                                })}
                            >
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={24} color={theme.colors.primary} />
                                </View>
                                <Text style={styles.menteeName}>{mentee.name}</Text>
                                <Ionicons name="arrow-forward" size={24} color={theme.colors.text.primary} />
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
        height: 120,
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 2,
    },
    backButton: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.text.primary,
        opacity: 0.3,
    },
    brandingHeader: {
        position: 'absolute',
        right: -20,
        top: 20,
    },
    logoDecor: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    content: {
        flex: 1,
        backgroundColor: '#EEEEEE',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: theme.spacing.lg,
    },
    titleRow: {
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    appTitle: {
        ...theme.typography.h1,
        fontSize: 32,
        color: theme.colors.primary,
    },
    listContent: {
        paddingBottom: theme.spacing.lg,
    },
    menteeCard: {
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    menteeName: {
        flex: 1,
        ...theme.typography.bodySemiBold,
        color: theme.colors.text.primary,
        fontSize: 18,
    },
    centerState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        gap: 12,
    },
    errorText: {
        ...theme.typography.body,
        color: theme.colors.status.error,
        textAlign: 'center',
    },
    emptyText: {
        ...theme.typography.body,
        color: theme.colors.text.secondary,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: theme.roundness.xl,
    },
    retryText: {
        ...theme.typography.button,
        color: '#FFFFFF',
    },
});
