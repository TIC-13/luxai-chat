import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { RagContextProvider } from '@/contexts/RagContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Roboto: require('../assets/fonts/Roboto-Regular.ttf'),
  });

  const headerBackground = useThemeColor('headerBackground');
  const headerTint = useThemeColor('headerTint');

  const toastConfig = useToastConfig()

  const defaultScreenOptions = {
    headerStyle: {
      backgroundColor: headerBackground,
    },
    headerTintColor: headerTint,
    headerTitleAlign: 'center',
  };

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RagContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: headerBackground,
              },
              headerTintColor: headerTint,
              headerTitleAlign: 'center',
            }}
          >
            <Stack.Screen
              name="(drawer)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(download)/index"
              options={{
                headerTitle: "Download Models",
              }}
            />
            <Stack.Screen
              name="context/index"
              options={{
                headerTitle: "Information found",
                presentation: "modal",
                animation: "slide_from_bottom",
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </RagContextProvider>
      <StatusBar style="auto" />
      <Toast config={toastConfig} />
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
