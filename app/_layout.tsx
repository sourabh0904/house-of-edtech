import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, AppState, AppStateStatus, View } from 'react-native';
import 'react-native-reanimated';
import '../global.css';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { OfflineBanner } from '../components/ui/OfflineBanner';
import { useNotifications } from '../hooks/useNotifications';
import { useAuthStore } from '../store/authStore';
import { useCourseStore } from '../store/courseStore';

function useProtectedRoute(user: any, isLoading: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  useEffect(() => {
    if (isLoading || !navigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page.
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from the sign-in page.
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading, navigationState]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadUser = useAuthStore((state) => state.loadUser);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const bookmarks = useCourseStore((state) => state.bookmarks);
  
  const { scheduleLocalNotification } = useNotifications();
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    loadUser();
  }, []);

  useProtectedRoute(user, isLoading);

  // Notification Logic
  useEffect(() => {
    // 5 Bookmarks milestone
    if (bookmarks.length === 5) {
        scheduleLocalNotification(
            "High Five! ✋", 
            "You've bookmarked 5 courses. Keep up the learning momentum!"
        );
    }
  }, [bookmarks.length]);

  useEffect(() => {
    // Schedule inactivity reminder when app goes to background
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // Schedule for 24 hours later
        scheduleLocalNotification(
            "We miss you! 🎓", 
            "It's been 24 hours since your last study session. Come back and learn something new!",
            24 * 60 * 60
        );
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'light' ? DarkTheme : DefaultTheme}>
      <OfflineBanner />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" />
        <Stack.Screen name="course/[id]/learn" options={{ presentation: 'modal' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
