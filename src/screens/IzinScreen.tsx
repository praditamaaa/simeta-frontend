import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { permissionService } from '../api/permissionService';
import { useAuthStore } from '../data/authStore';
import { theme } from '../theme/theme';

export const IzinScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { user } = useAuthStore();

    const [reason, setReason] = useState('');
    const [hasChanges, setHasChanges] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<{ reason?: string }>({});

    const handleReasonChange = (text: string) => {
        setReason(text);
        setHasChanges(true);
        if (errors.reason) setErrors((prev) => ({ ...prev, reason: undefined }));
    };

    const validate = (): boolean => {
        const newErrors: { reason?: string } = {};
        if (!reason.trim()) {
            newErrors.reason = 'Alasan izin wajib diisi.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBack = () => {
        if (hasChanges) {
            Alert.alert(
                'Konfirmasi',
                'Data yang sudah diisi akan hilang. Yakin keluar?',
                [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Keluar', style: 'destructive', onPress: () => router.back() },
                ]
            );
        } else {
            router.back();
        }
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setIsSubmitting(true);
        try {
            await permissionService.create({ reason: reason.trim() });
            Alert.alert(
                'Berhasil',
                'Izin berhasil diajukan.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (err: any) {
            Alert.alert(
                'Gagal',
                err.response?.data?.message || 'Terjadi kesalahan saat mengajukan izin.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pengajuan Izin</Text>
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Back button row */}
                <View style={styles.topRow}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                    <Text style={styles.subTitle}>Pengajuan Izin</Text>
                </View>

                <Text style={styles.instruction}>
                    Isi formulir berikut untuk mengajukan izin tidak hadir pada kegiatan Metagama.
                </Text>

                {/* Nama Lengkap (auto-filled, read-only) */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Nama Lengkap</Text>
                    <View style={[styles.inputContainer, styles.readonlyContainer]}>
                        <Ionicons name="person-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                        <Text style={styles.readonlyText}>{user?.name || '-'}</Text>
                    </View>
                </View>

                {/* Email (auto-filled, read-only) */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Email</Text>
                    <View style={[styles.inputContainer, styles.readonlyContainer]}>
                        <Ionicons name="mail-outline" size={18} color="#9CA3AF" style={styles.inputIcon} />
                        <Text style={styles.readonlyText}>{user?.email || '-'}</Text>
                    </View>
                </View>

                {/* Alasan Izin */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>
                        Alasan Izin <Text style={styles.required}>*</Text>
                    </Text>
                    <View style={[styles.textAreaContainer, errors.reason && styles.inputError]}>
                        <TextInput
                            value={reason}
                            onChangeText={handleReasonChange}
                            placeholder="Contoh: Sakit, keperluan keluarga, dll."
                            placeholderTextColor="#9CA3AF"
                            style={styles.textArea}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                    {errors.reason && (
                        <Text style={styles.errorText}>{errors.reason}</Text>
                    )}
                </View>

                {/* PDF Upload Placeholder */}
                <View style={styles.fieldGroup}>
                    <Text style={styles.fieldLabel}>Lampiran Dokumen (PDF)</Text>
                    <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
                        <Ionicons name="document-attach-outline" size={24} color={theme.colors.primary} />
                        <Text style={styles.uploadBoxText}>Unggah Surat Keterangan / Bukti</Text>
                        <View style={styles.uploadDashedBorder} />
                    </TouchableOpacity>
                    <Text style={styles.uploadHint}>* Maksimal ukuran file 2MB</Text>
                </View>

                {/* Catatan: bukti/dokumen pendukung */}
                <View style={styles.noteCard}>
                    <Ionicons name="information-circle-outline" size={18} color={theme.colors.secondary} />
                    <Text style={styles.noteText}>
                        Permohonan izin akan diverifikasi oleh mentor dan admin SIMETA.
                    </Text>
                </View>
            </ScrollView>

            {/* Submit Button */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.submitButtonText}>AJUKAN IZIN</Text>
                    )}
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
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
    },
    content: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: theme.spacing.lg,
        flexGrow: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        gap: theme.spacing.md,
    },
    backButton: {
        width: 44,
        height: 44,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subTitle: {
        ...theme.typography.h3,
        color: theme.colors.primary,
    },
    instruction: {
        ...theme.typography.body,
        color: '#6B7280',
        marginBottom: theme.spacing.lg,
        lineHeight: 22,
    },
    fieldGroup: {
        marginBottom: theme.spacing.md,
    },
    fieldLabel: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        marginBottom: 6,
        fontSize: 14,
    },
    required: {
        color: theme.colors.status.error,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: theme.roundness.xl,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: theme.spacing.md,
        height: 52,
    },
    readonlyContainer: {
        backgroundColor: '#F3F4F6',
    },
    inputIcon: {
        marginRight: 8,
    },
    readonlyText: {
        ...theme.typography.body,
        color: '#6B7280',
        flex: 1,
    },
    textAreaContainer: {
        backgroundColor: '#F9FAFB',
        borderRadius: theme.roundness.lg,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minHeight: 100,
    },
    textArea: {
        ...theme.typography.body,
        color: theme.colors.primary,
        minHeight: 90,
    },
    inputError: {
        borderColor: theme.colors.status.error,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.status.error,
        marginTop: 4,
    },
    uploadBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        height: 60,
        gap: 12,
        position: 'relative',
        overflow: 'hidden',
    },
    uploadBoxText: {
        ...theme.typography.body,
        color: theme.colors.primary,
        fontSize: 14,
    },
    uploadDashedBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        borderRadius: theme.roundness.lg,
        margin: 1.5,
        opacity: 0.2,
    },
    uploadHint: {
        ...theme.typography.caption,
        color: '#9CA3AF',
        marginTop: 6,
        fontSize: 11,
    },
    noteCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        backgroundColor: '#FFFBEB',
        borderRadius: theme.roundness.md,
        padding: theme.spacing.md,
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.secondary,
        marginTop: theme.spacing.sm,
    },
    noteText: {
        ...theme.typography.caption,
        color: '#92400E',
        flex: 1,
        lineHeight: 18,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    submitButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: 16,
        borderRadius: theme.roundness.xl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButtonDisabled: {
        opacity: 0.6,
    },
    submitButtonText: {
        ...theme.typography.button,
        color: '#FFFFFF',
        fontSize: 15,
    },
});
