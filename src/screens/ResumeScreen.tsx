import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { resumeService } from '../api/resumeService';
import { theme } from '../theme/theme';

export const ResumeScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim()) {
            Alert.alert('Eror', 'Judul materi wajib diisi.');
            return;
        }

        setIsLoading(true);
        try {
            // Placeholder for PDF upload logic
            // await resumeService.create({ ... });
            
            Alert.alert('Sukses', 'Resume berhasil dikirim!', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Gagal Kirim', error.response?.data?.message || 'Terjadi kesalahan saat mengirim resume');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pengumpulan Resume</Text>
            </View>

            <View style={[styles.content, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.formRow}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.titleInputContainer}>
                        <TextInput
                            placeholder="Masukkan Judul Materi..."
                            placeholderTextColor="rgba(13, 17, 49, 0.4)"
                            style={styles.titleInput}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
                </View>

                {/* PDF Upload Placeholder */}
                <TouchableOpacity style={styles.uploadContainer} activeOpacity={0.7}>
                    <View style={styles.uploadIconCircle}>
                        <Ionicons name="document-text" size={40} color={theme.colors.primary} />
                    </View>
                    <Text style={styles.uploadTitle}>Pilih File PDF</Text>
                    <Text style={styles.uploadSubtitle}>Format file harus .pdf (Maks. 5MB)</Text>
                    <View style={styles.uploadBorder} />
                </TouchableOpacity>

                <View style={styles.infoBox}>
                    <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
                    <Text style={styles.infoText}>
                        Pastikan isi resume sudah sesuai dengan format yang ditentukan sebelum diunggah.
                    </Text>
                </View>

                <TouchableOpacity 
                    style={[styles.submitButton, isLoading && { opacity: 0.7 }]} 
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                        <Text style={styles.submitButtonText}>Kirim Resume</Text>
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
        padding: theme.spacing.lg,
        alignItems: 'center',
    },
    headerTitle: {
        ...theme.typography.h2,
        color: theme.colors.text.primary,
    },
    content: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        padding: theme.spacing.lg,
    },
    formRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    backButton: {
        width: 45,
        height: 45,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    titleInputContainer: {
        flex: 1,
        backgroundColor: '#F3D2A6', // Distinct beige background from mockup
        borderRadius: theme.roundness.md,
        paddingHorizontal: theme.spacing.md,
        height: 50,
        justifyContent: 'center',
    },
    titleInput: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
    },
    uploadContainer: {
        flex: 1,
        backgroundColor: '#F3D2A6',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.md,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    uploadIconCircle: {
        width: 80,
        height: 80,
        backgroundColor: '#FFFFFF',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    uploadTitle: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    uploadSubtitle: {
        ...theme.typography.caption,
        color: 'rgba(13, 17, 49, 0.6)',
        textAlign: 'center',
    },
    uploadBorder: {
        ...StyleSheet.absoluteFillObject,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        borderStyle: 'dashed',
        borderRadius: theme.roundness.lg,
        margin: 2,
        opacity: 0.2,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(13, 17, 49, 0.05)',
        padding: theme.spacing.md,
        borderRadius: theme.roundness.md,
        marginBottom: theme.spacing.lg,
        gap: 10,
        alignItems: 'center',
    },
    infoText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        flex: 1,
        lineHeight: 18,
    },
    submitButton: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 15,
        borderRadius: theme.roundness.xl,
        alignItems: 'center',
    },
    submitButtonText: {
        ...theme.typography.button,
        color: theme.colors.text.primary,
    }
});
