import { useThemeColor } from '@/hooks/useThemeColor';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedViewProps } from './ThemedView';

export function ThemedSafeAreaView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor('background', { light: lightColor, dark: darkColor });

  return <SafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />;
}
