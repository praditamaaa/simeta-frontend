import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

export const AbsenMenteeScreen = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const menteeName = params.menteeName || 'Bahlil Lahadalia';

    const [attendance, setAttendance] = useState('Hadir');

    const attendanceOptions = ['Hadir', 'Terlambat', 'Izin/Sakit', 'Alpha'];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>Absensi Mentee</Text>
                </View>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom + 25 }]}>
                <View style={styles.subHeader}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.inputLabel}>Masukan Absensi Untuk:</Text>
                        <Text style={styles.menteeName}>{menteeName}</Text>
                    </View>
                </View>

                <ScrollView 
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.sectionTitle}>Kehadiran</Text>
                    <View style={styles.optionsContainer}>
                        {attendanceOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={styles.optionRow}
                                onPress={() => setAttendance(option)}
                            >
                                <Ionicons
                                    name={attendance === option ? "radio-button-on" : "radio-button-off"}
                                    size={24}
                                    color={theme.colors.secondary}
                                />
                                <Text style={styles.optionText}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Hasil Test</Text>
                    <View style={styles.testResultGrid}>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="add-circle" size={40} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="remove-circle" size={40} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="add-circle" size={40} color={theme.colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBtn}>
                            <Ionicons name="remove-circle" size={40} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.keteranganBox}>
                        <View style={styles.keteranganHeader}>
                            <Text style={styles.keteranganLabel}>Keterangan</Text>
                            <Ionicons name="close-circle-outline" size={20} color={theme.colors.primary} />
                        </View>
                        <TextInput
                            placeholder="Bacaan kurang lancar di ayat 3"
                            placeholderTextColor={theme.colors.text.secondary}
                            style={styles.keteranganInput}
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.saveButton}>
                        <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.text.primary} />
                        <Text style={styles.saveButtonText}>Simpan Absensi</Text>
                    </TouchableOpacity>
                </ScrollView>
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
        height: 80,
        justifyContent: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h1,
        color: theme.colors.text.primary,
        opacity: 0.3,
    },
    content: {
        flex: 1,
        backgroundColor: '#EEEEEE', // Maintain light grey for contrast in content
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: theme.spacing.lg,
    },
    subHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    backButton: {
        width: 50,
        height: 50,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    inputLabel: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
    },
    menteeName: {
        ...theme.typography.h2,
        color: theme.colors.secondary,
    },
    scrollContent: {
        paddingBottom: theme.spacing.lg,
    },
    sectionTitle: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    optionsContainer: {
        marginBottom: theme.spacing.md,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    optionText: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.secondary,
        marginLeft: theme.spacing.sm,
    },
    testResultGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    iconBtn: {
        padding: theme.spacing.xs,
    },
    keteranganBox: {
        backgroundColor: 'rgba(13, 17, 49, 0.1)',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        height: 150,
        marginBottom: theme.spacing.lg,
    },
    keteranganHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.xs,
    },
    keteranganLabel: {
        ...theme.typography.caption,
        fontFamily: theme.fonts.semiBold,
        color: theme.colors.primary,
    },
    keteranganInput: {
        ...theme.typography.body,
        color: theme.colors.primary,
        textAlignVertical: 'top',
        flex: 1,
    },
    saveButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 15,
        borderRadius: theme.roundness.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        ...theme.typography.button,
        color: theme.colors.text.primary,
        marginLeft: theme.spacing.sm,
    }
});
