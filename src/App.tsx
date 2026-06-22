import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';
import { useAppStore } from './store/useAppStore';
import { useIsDarkMode } from './utils/useIsDarkMode';

function AppContent() {
  const isDark = useIsDarkMode();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
}

export default function App() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAppStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
