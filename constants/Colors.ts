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

    headerBackground: '#0A7EA4',
    headerTint: '#fff',
    headerTintInactive: '#B0BEC5',

    userBubble: '#E1F5FE',
    systemBubble: '#E0E0E0',

    messageInputField: '#F5F5F5',
    placeholderTextColor: '#B0BEC5',

    iconContainer: '#F5F5F5',
    iconColor: '#11181C',

    buttonBackground: '#0A7EA4',
    buttonLabel: '#FFFFFF',

    toastBackground: '#F5F5F5', 
    toastTitle: '#11181C', 
    toastSubtitle: '#687076',

    progressBarFilled: '#0A7EA4', 
    progressBarUnfilled: '#E0E0E0',

    infoCardBackground: '#E3F2FD',
    infoCardIconTint: '#1976D2',
    infoCardTitleTint: '#0D47A1',
    infoCardTextTint: '#1565C0',

    warningCardBackground: '#FFF8E1',
    warningCardIconTint: '#FFA000',
    warningCardTitleTint: '#FF6F00',
    warningCardTextTint: '#FF8F00',

    activityIndicator: '#0A7EA4'

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

    buttonBackground: '#1F2933',
    buttonLabel: '#ECEDEE',

    toastBackground: '#2C2F33', 
    toastTitle: '#ECEDEE', 
    toastSubtitle: '#9BA1A6',

    progressBarFilled: '#0A7EA4',
    progressBarUnfilled: '#4B5563',

    infoCardBackground: '#1A237E',
    infoCardIconTint: '#64B5F6',
    infoCardTitleTint: '#BBDEFB',
    infoCardTextTint: '#90CAF9',

    warningCardBackground: '#3E2723',
    warningCardIconTint: '#FFD54F',
    warningCardTitleTint: '#FFECB3',
    warningCardTextTint: '#FFE082',

    activityIndicator: '#64B5F6',

  },
};
