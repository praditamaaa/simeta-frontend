import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';
import { HomeScreen } from '../../screens/HomeScreen';
import { NewsScreen } from '../../screens/NewsScreen';
import { ProfileScreen } from '../../screens/ProfileScreen';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TabNavigatorProps {
    initialIndex?: number;
}

export const MainTabNavigator = ({ initialIndex = 0 }: TabNavigatorProps) => {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeIndex, setActiveIndex] = useState(initialIndex);
    const translateX = useSharedValue(-initialIndex * SCREEN_WIDTH);

    useEffect(() => {
        // Sync index if initialIndex changes
        setActiveIndex(initialIndex);
        translateX.value = withSpring(-initialIndex * SCREEN_WIDTH, {
            damping: 20,
            stiffness: 90,
        });
    }, [initialIndex]);

    const panGesture = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .onUpdate((event) => {
            const currentOffset = -activeIndex * SCREEN_WIDTH;
            const newTranslateX = currentOffset + event.translationX;
            
            // Clamp value to prevent overscrolling past boundaries
            // Max is 0 (first page), Min is -2 * SCREEN_WIDTH (last page)
            translateX.value = Math.max(
                -(2 * SCREEN_WIDTH), 
                Math.min(0, newTranslateX)
            );
        })
        .onEnd((event) => {
            const threshold = SCREEN_WIDTH * 0.2;
            let nextIndex = activeIndex;

            if (event.translationX < -threshold && activeIndex < 2) {
                nextIndex = activeIndex + 1;
            } else if (event.translationX > threshold && activeIndex > 0) {
                nextIndex = activeIndex - 1;
            }

            translateX.value = withSpring(-nextIndex * SCREEN_WIDTH, {
                damping: 20,
                stiffness: 90,
            });
            runOnJS(setActiveIndex)(nextIndex);
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    const handleTabPress = (index: number) => {
        setActiveIndex(index);
        translateX.value = withSpring(-index * SCREEN_WIDTH);
    };

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[styles.pager, animatedStyle]}>
                    <View style={styles.page}>
                        <HomeScreen />
                    </View>
                    <View style={styles.page}>
                        <NewsScreen />
                    </View>
                    <View style={styles.page}>
                        <ProfileScreen />
                    </View>
                </Animated.View>
            </GestureDetector>

            {/* Shared Bottom Navigation Bar */}
            <View style={[styles.navBar, { paddingBottom: insets.bottom }]}>
                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => handleTabPress(0)}
                >
                    <Ionicons 
                        name={activeIndex === 0 ? "home" : "home-outline"} 
                        size={26} 
                        color={activeIndex === 0 ? theme.colors.secondary : theme.colors.primary} 
                    />
                    <Text style={[
                        styles.navLabel, 
                        activeIndex === 0 && styles.navLabelActive
                    ]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => handleTabPress(1)}
                >
                    <Ionicons 
                        name={activeIndex === 1 ? "newspaper" : "newspaper-outline"} 
                        size={26} 
                        color={activeIndex === 1 ? theme.colors.secondary : theme.colors.primary} 
                    />
                    <Text style={[
                        styles.navLabel, 
                        activeIndex === 1 && styles.navLabelActive
                    ]}>News</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.navItem} 
                    onPress={() => handleTabPress(2)}
                >
                    <Ionicons 
                        name={activeIndex === 2 ? "person" : "person-outline"} 
                        size={26} 
                        color={activeIndex === 2 ? theme.colors.secondary : theme.colors.primary} 
                    />
                    <Text style={[
                        styles.navLabel, 
                        activeIndex === 2 && styles.navLabelActive
                    ]}>Profil</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    pager: {
        flex: 1,
        flexDirection: 'row',
        width: SCREEN_WIDTH * 3,
    },
    page: {
        width: SCREEN_WIDTH,
        flex: 1,
    },
    navBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    navLabel: {
        fontSize: 11,
        fontFamily: theme.fonts.regular,
        color: theme.colors.primary,
        marginTop: 2,
    },
    navLabelActive: {
        color: theme.colors.secondary,
        fontFamily: theme.fonts.semiBold,
    },
});
