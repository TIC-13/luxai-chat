import { useEffect, useState } from "react";
import { Animated } from "react-native";
import { LLMMessage } from "../types/LLMMessage";

export default function useExapandMessage(message: LLMMessage) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [widthAnim, setWidthAnim] = useState(new Animated.Value(80)); // Start at 80%

    useEffect(() => {
        setIsExpanded(false)
        setWidthAnim(new Animated.Value(80))
    }, [message.message.content])

    function toggleExpand() {
        const toValue = isExpanded ? 80 : 100; // Toggle between 80% and 100%

        Animated.timing(widthAnim, {
            toValue,
            duration: 300,
            useNativeDriver: false,
        }).start();

        setIsExpanded(!isExpanded);
    }

    const dynamicMessageWidth = widthAnim.interpolate({
        inputRange: [0, 100],
        outputRange: ['0%', '100%'],
    });

    return { isExpanded, dynamicMessageWidth, toggleExpand }

}