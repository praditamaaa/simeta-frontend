import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

// Import JSON data
import kubroPagi from '../../assets/al-matsurat/pagi-petang/kubro-pagi.json';
import kubroPetang from '../../assets/al-matsurat/pagi-petang/kubro-petang.json';
import sugroPagi from '../../assets/al-matsurat/pagi-petang/sugro-pagi.json';
import sugroPetang from '../../assets/al-matsurat/pagi-petang/sugro-petang.json';

type MatsuratItem = {
    title: string;
    arab: string;
    latin: string;
    arti: string;
    read: number;
};

export const AlMatsuratScreen = () => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isKubro, setIsKubro] = useState(false);
    const [isPagi, setIsPagi] = useState(true);

    useEffect(() => {
        // Logic for UTC+7
        const now = new Date();
        const hours = now.getHours();
        if (hours >= 12) {
            setIsPagi(false);
        } else {
            setIsPagi(true);
        }
    }, []);

    const getData = () => {
        if (isKubro) {
            return isPagi ? kubroPagi : kubroPetang;
        } else {
            return isPagi ? sugroPagi : sugroPetang;
        }
    };

    const data = getData() as MatsuratItem[];

    const renderItem = ({ item }: { item: MatsuratItem }) => (
        <View style={styles.card}>
            <Text style={styles.itemTitle}>{item.title.replace(/&apos;/g, "'").replace(/&quot;/g, '"')}</Text>

            {item.arab !== '-' && (
                <Text style={styles.arabText}>{item.arab}</Text>
            )}

            {item.latin !== '-' && (
                <Text style={styles.latinText}>{item.latin.replace(/&apos;/g, "'")}</Text>
            )}

            {item.arti !== '-' && (
                <Text style={styles.artiText}>{item.arti.replace(/&apos;/g, "'").replace(/&quot;/g, '"')}</Text>
            )}

            {item.read > 0 && (
                <View style={styles.readBadge}>
                    <Text style={styles.readText}>Dibaca {item.read}x</Text>
                </View>
            )}
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.headerTitle}>Al-Ma'tsurat</Text>
                    <Text style={styles.headerSubtitle}>{isPagi ? 'Pagi' : 'Petang'} - {isKubro ? 'Kubro' : 'Sugro'}</Text>
                </View>
            </View>

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.toggleButton, !isKubro && styles.activeToggle]}
                    onPress={() => setIsKubro(false)}
                >
                    <Text style={[styles.toggleText, !isKubro && styles.activeToggleText]}>SUGRO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleButton, isKubro && styles.activeToggle]}
                    onPress={() => setIsKubro(true)}
                >
                    <Text style={[styles.toggleText, isKubro && styles.activeToggleText]}>KUBRO</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 20 }]}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EEEEEE',
    },
    header: {
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    backButton: {
        padding: theme.spacing.sm,
        marginRight: theme.spacing.xs,
    },
    titleContainer: {
        flex: 1,
    },
    headerTitle: {
        ...theme.typography.h3,
        color: theme.colors.text.primary,
        fontSize: 22,
    },
    headerSubtitle: {
        ...theme.typography.caption,
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
    },
    toggleContainer: {
        flexDirection: 'row',
        padding: theme.spacing.md,
        justifyContent: 'center',
    },
    toggleButton: {
        flex: 1,
        height: 45,
        backgroundColor: 'rgba(13, 17, 49, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.roundness.md,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: theme.colors.primary,
    },
    activeToggle: {
        backgroundColor: theme.colors.primary,
    },
    toggleText: {
        ...theme.typography.button,
        color: theme.colors.primary,
        fontSize: 14,
    },
    activeToggleText: {
        color: theme.colors.text.primary,
    },
    listContent: {
        padding: theme.spacing.md,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: theme.roundness.lg,
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    itemTitle: {
        ...theme.typography.h3,
        color: theme.colors.primary,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    arabText: {
        fontSize: 26,
        color: '#000',
        textAlign: 'right',
        lineHeight: 45,
        marginBottom: theme.spacing.md,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'serif',
    },
    latinText: {
        ...theme.typography.body,
        fontStyle: 'italic',
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    artiText: {
        ...theme.typography.body,
        color: '#4A5568',
        lineHeight: 20,
    },
    readBadge: {
        backgroundColor: theme.colors.secondary,
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 15,
        alignSelf: 'flex-end',
        marginTop: theme.spacing.md,
    },
    readText: {
        ...theme.typography.caption,
        color: theme.colors.primary,
        fontFamily: theme.fonts.bold,
    }
});
