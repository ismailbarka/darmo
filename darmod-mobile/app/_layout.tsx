import '@/core/services/firebase';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import {
  Jost_400Regular,
  Jost_500Medium,
  Jost_700Bold,
  useFonts
} from '@expo-google-fonts/jost';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-gesture-handler';

import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Jost: Jost_400Regular,
    'Jost-Medium': Jost_500Medium,
    'Jost-Bold': Jost_700Bold
  });

  useEffect(() => {
    const loadApp = async () => {
      if (loaded || error) {
        SplashScreen.hideAsync();
      }
    };
    loadApp();
  }, [error, loaded]);

  if (!loaded && !error) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={styles.container}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
