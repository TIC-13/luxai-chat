import { Message } from "@/app/chat/types/message";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";

export default function MessageBubble({ message }: { message: Message }) {
    
    const userBubbleColor = useThemeColor('userBubble')
    const systemBubbleColor = useThemeColor('systemBubble')

    return (
        <ThemedView 
            style={[
                {backgroundColor: message.sender === 'user' ? userBubbleColor : systemBubbleColor},
                styles.bubble,
                message.sender === 'user' ? styles.userBubble : styles.systemBubble
            ]}
        >
            <ThemedText>{message.text}</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    bubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        maxWidth: '80%',
    },
    userBubble: {
        borderBottomEndRadius: 0
    },
    systemBubble: {
        borderBottomStartRadius: 0
    }
})

