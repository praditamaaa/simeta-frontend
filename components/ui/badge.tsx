import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from '../../src/theme/theme';

interface BadgeProps {
    label: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
    style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = 'default',
    style
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'success':
                return { backgroundColor: theme.colors.status.success + '20', color: theme.colors.status.success };
            case 'warning':
                return { backgroundColor: theme.colors.status.warning + '20', color: theme.colors.status.warning };
            case 'error':
                return { backgroundColor: theme.colors.status.error + '20', color: theme.colors.status.error };
            case 'info':
                return { backgroundColor: theme.colors.status.info + '20', color: theme.colors.status.info };
            default:
                return { backgroundColor: theme.colors.border, color: theme.colors.text.secondary };
        }
    };

    const vStyle = getVariantStyle();

    return (
        <View style={[styles.badge, { backgroundColor: vStyle.backgroundColor }, style]}>
            <Text style={[styles.text, { color: vStyle.color }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
        borderRadius: theme.roundness.full,
        alignSelf: 'flex-start',
    },
    text: {
        ...theme.typography.caption,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
});
