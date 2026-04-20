import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AnswerDto, Question, Quiz, quizService } from '../api/quizService';
import { useAuthStore } from '../data/authStore';
import { theme } from '../theme/theme';

type TestType = 'PRETEST' | 'POSTTEST';

interface QuizWithQuestions extends Quiz {
    questions: Question[];
}

export const TestScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { type } = useLocalSearchParams<{ type: string }>();
    const testType: TestType | 'ALL' = (type === 'POSTTEST' || type === 'PRETEST' ? type : 'ALL');

    const { _hasHydrated, deviceId } = useAuthStore();

    const [step, setStep] = useState<'list' | 'quiz' | 'result'>('list');
    const [quizList, setQuizList] = useState<Quiz[]>([]);
    const [activeQuiz, setActiveQuiz] = useState<QuizWithQuestions | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [resultScore, setResultScore] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!_hasHydrated || !deviceId) return;

        const fetchQuizzes = async () => {
            setIsLoading(true);
            try {
                const data = await quizService.findAll();
                const filtered = testType === 'ALL' 
                    ? data 
                    : data.filter((q) => q.type === testType);
                setQuizList(filtered);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Gagal memuat daftar kuis.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuizzes();
    }, [testType, _hasHydrated, deviceId]);

    const handleStartQuiz = async (quiz: Quiz) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await quizService.startQuiz(quiz.id);
            setActiveQuiz({ ...data, type: quiz.type });
            setCurrentQuestion(0);
            setAnswers({});
            setStep('quiz');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memulai kuis.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAnswer = (questionId: string, optionIdx: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    };

    const handleNext = () => {
        if (activeQuiz && currentQuestion < activeQuiz.questions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!activeQuiz) return;

        const unanswered = activeQuiz.questions.filter((q) => answers[q.id] === undefined);
        if (unanswered.length > 0) {
            Alert.alert(
                'Belum Selesai',
                `Masih ada ${unanswered.length} soal yang belum dijawab. Lanjutkan?`,
                [
                    { text: 'Lanjut Isi', style: 'cancel' },
                    { text: 'Kirim', onPress: () => submitAnswers() },
                ]
            );
            return;
        }
        submitAnswers();
    };

    const submitAnswers = async () => {
        if (!activeQuiz) return;
        setIsSubmitting(true);
        try {
            const answerList: AnswerDto[] = Object.entries(answers).map(([questionId, selectedIdx]) => ({
                questionId,
                selectedIdx,
            }));
            const result = await quizService.submitQuiz(activeQuiz.id, { answers: answerList });
            setResultScore(result?.score ?? null);
            setStep('result');
        } catch (err: any) {
            Alert.alert('Gagal', err.response?.data?.message || 'Terjadi kesalahan saat mengirim jawaban.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBackFromQuiz = () => {
        Alert.alert(
            'Keluar dari Test?',
            'Jawaban yang sudah diisi akan hilang.',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Keluar', style: 'destructive', onPress: () => setStep('list') },
            ]
        );
    };

    const OPTION_LABELS = ['A', 'B', 'C', 'D'];
    const title = testType === 'ALL' ? 'Kuis & Test' : (testType === 'PRETEST' ? 'Pre-Test' : 'Post-Test');

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={step === 'quiz' ? handleBackFromQuiz : () => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title}</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* List Step */}
            {step === 'list' && (
                <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
                    {isLoading ? (
                        <View style={styles.centerState}>
                            <ActivityIndicator size="large" color={theme.colors.secondary} />
                        </View>
                    ) : error ? (
                        <View style={styles.centerState}>
                            <Ionicons name="cloud-offline-outline" size={60} color={theme.colors.text.secondary} />
                            <Text style={styles.stateText}>{error}</Text>
                        </View>
                    ) : quizList.length === 0 ? (
                        <View style={styles.centerState}>
                            <Ionicons name="clipboard-outline" size={60} color={theme.colors.text.secondary} />
                            <Text style={styles.stateText}>Belum ada {title} tersedia.</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                            <Text style={styles.instructionText}>
                                Pilih {title} yang ingin dikerjakan:
                            </Text>
                            {quizList.map((quiz) => (
                                <TouchableOpacity
                                    key={quiz.id}
                                    style={styles.quizCard}
                                    onPress={() => handleStartQuiz(quiz)}
                                >
                                    <View style={styles.quizCardLeft}>
                                        <Ionicons name="clipboard-outline" size={28} color={theme.colors.secondary} />
                                        <View style={styles.quizCardInfo}>
                                            <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                                            <View style={[
                                                styles.badge,
                                                quiz.type === 'POSTTEST' ? styles.badgePost : styles.badgePre
                                            ]}>
                                                <Text style={styles.badgeText}>{quiz.type}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Ionicons name="play-circle-outline" size={28} color={theme.colors.secondary} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>
            )}

            {/* Quiz Step */}
            {step === 'quiz' && activeQuiz && (
                <View style={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
                    {/* Progress indicator */}
                    <View style={styles.quizProgress}>
                        <Text style={styles.quizProgressText}>
                            Soal {currentQuestion + 1} dari {activeQuiz.questions.length}
                        </Text>
                        <View style={styles.quizProgressBarBg}>
                            <View
                                style={[
                                    styles.quizProgressBarFill,
                                    {
                                        width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                    </View>

                    <ScrollView contentContainerStyle={styles.quizContent} showsVerticalScrollIndicator={false}>
                        {/* Question */}
                        <Text style={styles.questionText}>
                            {activeQuiz.questions[currentQuestion]?.text}
                        </Text>

                        {/* Options */}
                        {activeQuiz.questions[currentQuestion]?.options.map((option, idx) => {
                            const qId = activeQuiz.questions[currentQuestion].id;
                            const isSelected = answers[qId] === idx;
                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                                    onPress={() => handleSelectAnswer(qId, idx)}
                                    activeOpacity={0.8}
                                >
                                    <View style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                                        <Text style={[styles.optionLabelText, isSelected && styles.optionLabelTextSelected]}>
                                            {OPTION_LABELS[idx]}
                                        </Text>
                                    </View>
                                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>

                    {/* Navigation buttons */}
                    <View style={[styles.quizNavBar, { paddingBottom: insets.bottom + 8 }]}>
                        <TouchableOpacity
                            style={[styles.navBtn, currentQuestion === 0 && styles.navBtnDisabled]}
                            onPress={handlePrev}
                            disabled={currentQuestion === 0}
                        >
                            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
                            <Text style={styles.navBtnText}>Sebelumnya</Text>
                        </TouchableOpacity>

                        {currentQuestion < activeQuiz.questions.length - 1 ? (
                            <TouchableOpacity style={styles.navBtnPrimary} onPress={handleNext}>
                                <Text style={styles.navBtnText}>Selanjutnya</Text>
                                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.navBtnSubmit, isSubmitting && styles.navBtnDisabled]}
                                onPress={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Text style={styles.navBtnText}>Kirim Jawaban</Text>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Result Step */}
            {step === 'result' && (
                <View style={[styles.content, { paddingBottom: insets.bottom + 24, justifyContent: 'center', alignItems: 'center' }]}>
                    <View style={styles.resultCard}>
                        <Ionicons name="checkmark-circle" size={80} color={theme.colors.status.success} />
                        <Text style={styles.resultTitle}>Test Selesai!</Text>
                        {resultScore !== null && (
                            <>
                                <Text style={styles.resultScoreLabel}>Skor Anda</Text>
                                <Text style={styles.resultScore}>{resultScore}</Text>
                            </>
                        )}
                        <Text style={styles.resultNote}>Jawaban tidak dapat diubah setelah submit.</Text>
                        <TouchableOpacity
                            style={styles.resultButton}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.resultButtonText}>Kembali ke Home</Text>
                        </TouchableOpacity>
                    </View>
                </View>
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
    content: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
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
        textAlign: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    listContent: {
        padding: theme.spacing.lg,
    },
    instructionText: {
        ...theme.typography.body,
        color: '#374151',
        marginBottom: theme.spacing.md,
    },
    quizCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    quizCardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 12,
    },
    quizCardInfo: { flex: 1 },
    quizCardTitle: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        fontSize: 15,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginTop: 4,
    },
    badgePre: {
        backgroundColor: '#E0F2FE', // Light blue
    },
    badgePost: {
        backgroundColor: '#FEF3C7', // Light orange
    },
    badgeText: {
        fontSize: 10,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
    },
    quizProgress: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    quizProgressText: {
        ...theme.typography.caption,
        color: '#374151',
        fontFamily: theme.fonts.semiBold,
        marginBottom: 6,
    },
    quizProgressBarBg: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: theme.roundness.full,
        overflow: 'hidden',
    },
    quizProgressBarFill: {
        height: '100%',
        backgroundColor: theme.colors.secondary,
        borderRadius: theme.roundness.full,
    },
    quizContent: {
        padding: theme.spacing.lg,
    },
    questionText: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        fontSize: 18,
        lineHeight: 26,
        marginBottom: theme.spacing.lg,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.sm,
        borderWidth: 2,
        borderColor: 'transparent',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    optionCardSelected: {
        borderColor: theme.colors.secondary,
        backgroundColor: '#FFF8EC',
    },
    optionLabel: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
    },
    optionLabelSelected: {
        backgroundColor: theme.colors.secondary,
    },
    optionLabelText: {
        ...theme.typography.bodySemiBold,
        color: theme.colors.primary,
        fontSize: 15,
    },
    optionLabelTextSelected: {
        color: '#FFFFFF',
    },
    optionText: {
        ...theme.typography.body,
        color: '#374151',
        flex: 1,
        fontSize: 15,
    },
    optionTextSelected: {
        color: theme.colors.primary,
        fontFamily: theme.fonts.semiBold,
    },
    quizNavBar: {
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.sm,
        gap: theme.spacing.sm,
        backgroundColor: '#F5F5F5',
    },
    navBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#6B7280',
        borderRadius: theme.roundness.xl,
        paddingVertical: 14,
        gap: 6,
    },
    navBtnPrimary: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.roundness.xl,
        paddingVertical: 14,
        gap: 6,
    },
    navBtnSubmit: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.status.success,
        borderRadius: theme.roundness.xl,
        paddingVertical: 14,
        gap: 6,
    },
    navBtnDisabled: {
        opacity: 0.4,
    },
    navBtnText: {
        ...theme.typography.button,
        color: '#FFFFFF',
        fontSize: 14,
    },
    resultCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        marginHorizontal: theme.spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    resultTitle: {
        ...theme.typography.h2,
        color: theme.colors.primary,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.sm,
    },
    resultScoreLabel: {
        ...theme.typography.body,
        color: '#6B7280',
    },
    resultScore: {
        fontSize: 64,
        fontFamily: theme.fonts.bold,
        color: theme.colors.secondary,
        lineHeight: 76,
    },
    resultNote: {
        ...theme.typography.caption,
        color: '#9CA3AF',
        textAlign: 'center',
        marginVertical: theme.spacing.md,
    },
    resultButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.roundness.xl,
        marginTop: theme.spacing.sm,
    },
    resultButtonText: {
        ...theme.typography.button,
        color: '#FFFFFF',
    },
});
