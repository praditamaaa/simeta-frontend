import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';
import { theme } from '../../src/theme/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'error';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    style,
    textStyle,
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'secondary':
                return styles.secondary;
            case 'outline':
                return styles.outline;
            case 'ghost':
                return styles.ghost;
            case 'error':
                return styles.error;
            default:
                return styles.primary;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
            case 'outline':
            case 'ghost':
                return { color: theme.colors.primary };
            default:
                return { color: theme.colors.text.inverse };
        }
    };

    const getSizeStyle = () => {
        switch (size) {
            case 'sm':
                return styles.sizeSm;
            case 'lg':
                return styles.sizeLg;
            default:
                return styles.sizeMd;
        }
    };

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                getVariantStyle(),
                getSizeStyle(),
                disabled && styles.disabled,
                style,
            ]}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.text.inverse} />
            ) : (
                <Text style={[styles.text, getTextStyle(), textStyle]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: theme.roundness.xl, // More rounded as per mockup
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: theme.colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: theme.colors.primary,
    },
    ghost: {
        backgroundColor: 'transparent',
    },
    error: {
        backgroundColor: theme.colors.status.error,
    },
    sizeSm: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        height: 40,
    },
    sizeMd: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        height: 55, // Standard height from mockup
    },
    sizeLg: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        height: 65,
    },
    text: {
        ...theme.typography.button,
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
});
