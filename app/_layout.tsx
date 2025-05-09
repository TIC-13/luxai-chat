import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RagContextProvider } from '@/contexts/RagContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RagContextProvider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="(chat)/index" />
          <Stack.Screen name="context/index" options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerTitle: "Information founded"
          }}/>
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
      </RagContextProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
