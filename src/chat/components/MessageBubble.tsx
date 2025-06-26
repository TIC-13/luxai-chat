import HTML from "@/components/HTML";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRagContext } from "@/contexts/RagContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet } from "react-native";
import { LLMMessage } from "../types/LLMMessage";

export default function MessageBubble({ message }: { message: LLMMessage }) {

    const userBubbleColor = useThemeColor('userBubble')
    const systemBubbleColor = useThemeColor('systemBubble')
    const textColor = useThemeColor('text');

    const { setRagContexts } = useRagContext()

    function navigateToContextModal() {
        if(message.contexts === undefined || message.contexts.length === 0) 
            return
        setRagContexts(message.contexts)
        router.navigate("/context")
    }

    return (
        <ThemedView
            style={[
                { backgroundColor: message.message.role === 'user' ? userBubbleColor : systemBubbleColor },
                styles.bubble,
                message.message.role === 'user' ? styles.userBubble : styles.systemBubble
            ]}
        >
            {
                message.contexts !== undefined && message.contexts.length > 0 &&
                <ContextBubble onPress = {navigateToContextModal}/>
            }
            <HTML>
                {message.message.content}
            </HTML>
        </ThemedView>
    )
}

function ContextBubble({onPress}: {onPress?: () => void}) {

    const systemBubbleColor = useThemeColor('systemBubble')

    return (
        <Pressable 
            style={styles.contextBubbleContainer} 
            onPress={onPress} 
            android_ripple={{ color: systemBubbleColor }}
        >
                <MaterialCommunityIcons name='book' size = {15} color = 'black'/>
                <ThemedText
                    style={styles.contextBubbleText}
                >
                    Show information found
                </ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    bubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: '80%',
    },
    userBubble: {
        borderBottomEndRadius: 0,

    },
    systemBubble: {
        borderBottomStartRadius: 0
    },

    contextBubbleContainer: {
        maxWidth: "80%",
        alignItems: 'center',
        flexDirection: 'row',
        marginBottom: 15,
        paddingVertical: 5,
        paddingHorizontal: 10,
        columnGap: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
    },
    contextBubbleText: {
        //fontWeight: 'medium',
        color: '#007BFF',
        textAlignVertical: 'center',
        fontSize: 13,
    },
})

