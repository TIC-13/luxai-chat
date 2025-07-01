import HTML from "@/components/HTML";
import { ThemedText } from "@/components/ThemedText";
import { useRagContext } from "@/contexts/RagContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import useExapandMessage from "../hooks/useExpandMessage";
import { LLMMessage } from "../types/LLMMessage";

export default function MessageBubble({ message }: { message: LLMMessage }) {

    const userBubbleColor = useThemeColor('userBubble')
    const systemBubbleColor = useThemeColor('systemBubble')
    const textColor = useThemeColor('text');

    const { setRagContexts } = useRagContext()
    const {isExpanded, dynamicMessageWidth, toggleExpand} = useExapandMessage(message)

    function navigateToContextModal() {
        if (message.contexts === undefined || message.contexts.length === 0)
            return
        setRagContexts(message.contexts)
        router.navigate("/context")
    }

    return (
        <Animated.View
            style={[
                {
                    backgroundColor: message.message.role === 'user' ? userBubbleColor : systemBubbleColor,
                },
                styles.bubble,
                message.message.role === 'user' ? styles.userBubble : styles.systemBubble,
                {
                    width: message.message.role === 'user' ? '80%' : dynamicMessageWidth
                }
            ]}
        >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: "100%"}}>
                {
                    message.contexts !== undefined && message.contexts.length > 0 &&
                    <ContextBubble onPress={navigateToContextModal} />
                }

                {message.message.role !== "user" && (
                    <Pressable
                        style={styles.expandButton}
                        onPress={toggleExpand}
                        android_ripple={{ color: systemBubbleColor, radius: 15 }}
                    >
                        <MaterialCommunityIcons
                            name={isExpanded ? "arrow-collapse-horizontal" : "arrow-expand-horizontal"}
                            size={16}
                            color={textColor}
                        />
                    </Pressable>
                )}
            </View>
            <HTML>
                {message.message.content}
            </HTML>
        </Animated.View>
    )
}

function ContextBubble({ onPress }: { onPress?: () => void }) {

    const systemBubbleColor = useThemeColor('systemBubble')

    return (
        <Pressable
            style={styles.contextBubbleContainer}
            onPress={onPress}
            android_ripple={{ color: systemBubbleColor }}
        >
            <MaterialCommunityIcons name='book' size={15} color='black' />
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
        position: 'relative',
    },
    userBubble: {
        borderBottomEndRadius: 0,
    },
    systemBubble: {
        borderBottomStartRadius: 0
    },
    expandButton: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
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