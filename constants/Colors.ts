/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,

    headerBackground: '#F5F5F5',
    headerTint: '#11181C',
    headerTintInactive: '#B0BEC5',

    userBubble: '#E1F5FE',
    systemBubble: '#E0E0E0',

    messageInputField: '#F5F5F5',
    placeholderTextColor: '#B0BEC5',

    iconContainer: '#F5F5F5',
    iconColor: '#11181C',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    headerBackground: '#2C2F33',
    headerTint: '#ECEDEE',
    headerTintInactive: '#B0BEC5',

    userBubble: '#0A7EA4',
    systemBubble: '#2C2F33',

    messageInputField: '#2C2F33',
    placeholderTextColor: '#B0BEC5',

    iconContainer: '#2C2F33',
    iconColor: '#ECEDEE',
  },
};
