import Animated from "react-native-reanimated";

export default function rollToBottom(scrollViewRef: React.RefObject<Animated.ScrollView | null>) {
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }
}