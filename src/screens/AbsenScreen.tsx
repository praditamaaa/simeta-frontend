import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { attendanceService } from '../api/absenService';
import { theme } from '../theme/theme';

export const AbsenScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isLoading, setIsLoading] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Get current time and date 
    const currentTime = new Date().toLocaleTimeString('id-ID', { hour12: false, hour: '2-digit', minute: '2-digit' }) + ' WIB';
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Izin akses lokasi ditolak');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation(loc);
        })();
    }, []);

    const handleCheckIn = async () => {
        if (!location) {
            Alert.alert('Eror', 'Sedang mengambil lokasi, silakan tunggu sebentar...');
            return;
        }

        setIsLoading(true);
        try {
            await attendanceService.checkIn({
                sessionId: 'current-session-id', // TODO: Fetch real session ID
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            Alert.alert('Sukses', 'Berhasil melakukan absensi!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            console.error('Check-in error:', error);
            Alert.alert('Gagal Absen', error.response?.data?.message || 'Terjadi kesalahan saat melakukan absensi');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Absensi Kehadiran</Text>

                <View style={styles.timeContainer}>
                    <Text style={styles.timeText}>{currentTime}</Text>
                    <Text style={styles.dateText}>{currentDate}</Text>
                </View>

                <View style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                        <Text style={styles.locationTitle}>Lokasi Anda</Text>
                        <Ionicons name="location-sharp" size={18} color={theme.colors.primary} />
                    </View>
                    {errorMsg ? (
                        <Text style={[styles.locationDetail, { color: theme.colors.status.error }]}>{errorMsg}</Text>
                    ) : location ? (
                        <>
                            <Text style={styles.locationDetail}>Lat: {location.coords.latitude.toFixed(6)}</Text>
                            <Text style={styles.locationDetail}>Long: {location.coords.longitude.toFixed(6)}</Text>
                        </>
                    ) : (
                        <ActivityIndicator color={theme.colors.primary} />
                    )}
                </View>

                {/* Ketentuan Absensi */}
                <View style={styles.rulesCard}>
                    <View style={styles.rulesHeader}>
                        <Ionicons name="alert-circle-outline" size={18} color={theme.colors.secondary} />
                        <Text style={styles.rulesTitle}>Ketentuan Absensi</Text>
                    </View>
                    <View style={styles.rulesList}>
                        <View style={styles.ruleItem}>
                            <View style={styles.ruleDot} />
                            <Text style={styles.ruleText}>Absensi hanya dapat dilakukan di lokasi kegiatan Metagama.</Text>
                        </View>
                        <View style={styles.ruleItem}>
                            <View style={styles.ruleDot} />
                            <Text style={styles.ruleText}>Pastikan status lokasi (GPS) sudah akurat sebelum menekan tombol absen.</Text>
                        </View>
                        <View style={styles.ruleItem}>
                            <View style={styles.ruleDot} />
                            <Text style={styles.ruleText}>Gunakan koneksi internet yang stabil untuk kelancaran data.</Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.absenButton, isLoading && styles.disabledButton]} 
                    onPress={handleCheckIn}
                    disabled={isLoading}
                >
                    <Text style={styles.absenButtonText}>{isLoading ? 'MENGIRIM...' : 'ABSEN SEKARANG'}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footerBranding}>
                <Text style={styles.brandingText}>SIMETA APP</Text>
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
        padding: theme.spacing.md,
    },
    backButton: {
        width: 45,
        height: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        alignItems: 'center',
        paddingTop: theme.spacing.xl,
    },
    title: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
        fontSize: 28,
        marginBottom: theme.spacing.xl,
    },
    timeContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    timeText: {
        ...theme.typography.h1,
        fontSize: 54,
        color: theme.colors.secondary,
    },
    dateText: {
        ...theme.typography.body,
        color: theme.colors.text.primary,
        opacity: 0.7,
        marginTop: theme.spacing.xs,
    },
    locationCard: {
        backgroundColor: theme.colors.text.secondary, // Light grey surface
        width: '100%',
        borderRadius: 30,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        alignItems: 'center',
    },
    rulesCard: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderRadius: 20,
        padding: theme.spacing.md,
        marginBottom: 50,
    },
    rulesHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    rulesTitle: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.secondary,
        fontSize: 14,
    },
    rulesList: {
        gap: 6,
    },
    ruleItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
    },
    ruleDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: theme.colors.secondary,
        marginTop: 8,
    },
    ruleText: {
        ...theme.typography.caption,
        color: theme.colors.text.primary,
        fontSize: 12,
        lineHeight: 18,
        flex: 1,
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    locationTitle: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        marginRight: 5,
    },
    locationDetail: {
        ...theme.typography.body,
        color: theme.colors.primary,
        fontSize: 16,
    },
    absenButton: {
        backgroundColor: theme.colors.secondary,
        width: '80%',
        height: 60,
        borderRadius: theme.roundness.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabledButton: {
        opacity: 0.7,
    },
    absenButtonText: {
        ...theme.typography.button,
        color: theme.colors.primary,
        fontSize: 20,
        fontFamily: theme.fonts.extraBold,
    },
    footerBranding: {
        paddingBottom: theme.spacing.xl,
        alignItems: 'center',
    },
    brandingText: {
        ...theme.typography.h1,
        fontSize: 32,
        color: 'rgba(255, 255, 255, 0.1)',
    }
});
