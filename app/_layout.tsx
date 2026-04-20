import { useFonts } from 'expo-font';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../src/data/authStore';
import { getDeviceId } from '../src/utils/device';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Keep splash screen visible until fonts are loaded
SplashScreen.preventAutoHideAsync();

function DevRouteSelector({ onSelect }: { onSelect: () => void }) {
  const { login } = useAuthStore();
  const router = useRouter();

  const handleBypass = (role: 'MAHASISWA' | 'MENTOR') => {
    login({
      user: {
        id: `dev-${role.toLowerCase()}`,
        name: `Dev ${role}`,
        email: `dev-${role.toLowerCase()}@simeta.test`,
      },
      role,
      accessToken: 'dev-token',
    });

    onSelect();
    // Use a small timeout to let the state update before navigating
    setTimeout(() => {
      if (router.canGoBack()) {
        router.replace('/(main)/home');
      } else {
        router.replace('/(main)/home');
      }
    }, 100);
  };

  return (
    <View style={styles.devOverlay}>
      <View style={styles.devModal}>
        <Text style={styles.devTitle}>Development Menu</Text>
        <Text style={styles.devSubtitle}>Pilih halaman awal untuk testing:</Text>

        <TouchableOpacity 
          style={[styles.devButton, { backgroundColor: '#4CAF50' }]} 
          onPress={onSelect}
        >
          <Text style={styles.devButtonText}>Normal (Login Screen)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.devButton, { backgroundColor: '#2196F3' }]} 
          onPress={() => handleBypass('MAHASISWA')}
        >
          <Text style={styles.devButtonText}>Direct Home (As Mahasiswa)</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.devButton, { backgroundColor: '#9C27B0' }]} 
          onPress={() => handleBypass('MENTOR')}
        >
          <Text style={styles.devButtonText}>Direct Home (As Mentor)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [hasSelectedRoute, setHasSelectedRoute] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Thin': require('../assets/fonts/Poppins/Poppins-Thin.ttf'),
    'Poppins-ExtraLight': require('../assets/fonts/Poppins/Poppins-ExtraLight.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-ExtraBold': require('../assets/fonts/Poppins/Poppins-ExtraBold.ttf'),
    'Poppins-Black': require('../assets/fonts/Poppins/Poppins-Black.ttf'),
  });

  const { setDeviceId, deviceId } = useAuthStore();

  useEffect(() => {
    const initDevice = async () => {
      try {
        if (!deviceId) {
          const id = await getDeviceId();
          setDeviceId(id);
        }
      } catch (error) {
        console.error('Failed to initialize device ID:', error);
      }
    };
    
    if (_hasHydrated) {
      initDevice();
    }
  }, [_hasHydrated, deviceId, setDeviceId]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
      // Small delay to ensure layout is mounted before any potential redirects
      const timer = setTimeout(() => setIsReady(true), 50);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key || !_hasHydrated || !fontsLoaded) return;
    
    // In dev, wait for route selection
    if (__DEV__ && !hasSelectedRoute) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(main)/home');
    }
  }, [isAuthenticated, segments, rootNavigationState?.key, _hasHydrated, fontsLoaded, hasSelectedRoute, isReady]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(main)" />
        </Stack>
        {__DEV__ && !hasSelectedRoute && (
          <DevRouteSelector onSelect={() => setHasSelectedRoute(true)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  devOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  devModal: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  devTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  devSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  devButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  devButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
