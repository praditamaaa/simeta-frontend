import { Stack } from 'expo-router';

export default function MainLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="home" />
            <Stack.Screen name="absen" />
            <Stack.Screen name="list-mentee" />
            <Stack.Screen name="absen-mentee" />
            <Stack.Screen name="resume" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="matsurat" />
            <Stack.Screen name="news" />
            <Stack.Screen name="news-detail" />
            <Stack.Screen name="progress-peserta" />
            <Stack.Screen name="test" />
            <Stack.Screen name="activity" />
            <Stack.Screen name="activity-detail" />
            <Stack.Screen name="izin" />
        </Stack>
    );
}
