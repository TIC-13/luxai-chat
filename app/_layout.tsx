import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RagContextProvider } from '@/contexts/RagContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const toastConfig = useToastConfig()

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RagContextProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(download)/index" options={{ headerShown: false }} />
            <Stack.Screen name="chat/index" />
            <Stack.Screen name="context/index" options={{
              presentation: "modal",
              animation: "slide_from_bottom",
              headerTitle: "Information founded"
            }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </RagContextProvider>
      <StatusBar style="auto" />
      <Toast
        config={toastConfig}

      />
    </ThemeProvider>
  );
}

function useToastConfig() {

  const toastBackground = useThemeColor('toastBackground')
  const toastTitle = useThemeColor('toastTitle')
  const toastSubtitle = useThemeColor('toastSubtitle')

  const toastConfig = {
    success: (props: BaseToastProps) => (
      <BaseToast
        {...props}
        style={{ 
          backgroundColor: toastBackground 
        }}
        text1Style={{
          color: toastTitle,
          fontSize: 15,
        }}
        text2Style={{
          color: toastSubtitle,
          fontSize: 12
        }}
      />
    ),
    error: (props: BaseToastProps) => (
      <ErrorToast
        {...props}
        style={{ 
          backgroundColor: toastBackground, 
          borderLeftColor: 'red' 
        }}
        text1Style={{
          color: toastTitle,
          fontSize: 15,
        }}
        text2Style={{
          color: toastSubtitle,
          fontSize: 12
        }}
      />
    ),

  };

  return toastConfig
}
