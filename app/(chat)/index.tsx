import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import MessageBubble from "@/src/chat/components/MessageBubble";
import MessageInputField from "@/src/chat/components/MessageInputField";
import useLLM from "@/src/chat/hooks/useLLM";
import { useEffect, useRef } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function ChatLayout() {

    const { messages, sendMessage, isUnableToSend } = useLLM()
    const scrollViewRef = useRef<Animated.ScrollView>(null);

    function rollToBottom() {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }

    useEffect(() => {
        rollToBottom()
    }, [messages]);

    return (
        <ThemedSafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={styles.mainContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
            >
                <Animated.ScrollView
                    ref={scrollViewRef}
                    style={styles.bubblesContainer}
                >
                    {
                        messages.map((message, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.bubbleContainer,
                                    message.role === 'user' ? styles.userBubbleContainer : styles.systemBubbleContainer
                                ]}
                            >
                                <MessageBubble key={index} message={message} />
                            </View>
                        ))
                    }
                    <View style={{ height: 15 }} />
                </Animated.ScrollView>
                <View style={styles.messageInputContainer}>
                    <MessageInputField
                        isLoading={isUnableToSend}
                        onSend={(prompt) => {
                            sendMessage(prompt)
                        }}
                        onPress={rollToBottom}
                    />
                </View>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //paddingVertical: 0,
    },
    bubblesContainer: {
        rowGap: 10,
        paddingHorizontal: 20,
        width: '100%',
        flex: 1,
    },
    bubbleContainer: {
        width: '100%',
    },
    userBubbleContainer: {
        alignItems: "flex-end",
    },
    systemBubbleContainer: {
        alignItems: "flex-start",
    },
    messageInputContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 0,
        justifyContent: "center",
        alignItems: "center",
    }
})
