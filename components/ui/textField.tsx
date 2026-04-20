import React from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
    ViewStyle
} from 'react-native';
import { theme } from '../../src/theme/theme';

interface TextFieldProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: ViewStyle;
}

export const TextField: React.FC<TextFieldProps> = ({
    label,
    error,
    containerStyle,
    style,
    ...props
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[
                    styles.input,
                    error ? styles.inputError : null,
                    style,
                ]}
                placeholderTextColor={theme.colors.text.secondary}
                {...props}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
        width: '100%',
    },
    label: {
        ...theme.typography.caption,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing.xs,
        fontFamily: theme.fonts.semiBold,
    },
    input: {
        ...theme.typography.body,
        backgroundColor: '#FFFFFF', // Often white in mockups even on dark backgrounds
        borderWidth: 1.5,
        borderColor: theme.colors.border,
        borderRadius: theme.roundness.xl, // Very rounded as per mockup
        paddingHorizontal: theme.spacing.md,
        height: 55,
        color: theme.colors.text.inverse,
    },
    inputError: {
        borderColor: theme.colors.status.error,
    },
    errorText: {
        ...theme.typography.caption,
        color: theme.colors.status.error,
        marginTop: theme.spacing.xs,
        marginLeft: theme.spacing.sm,
    },
});
