import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useThemeColor } from "@/hooks/useThemeColor";
import MessageBubble from "@/src/chat/components/MessageBubble";
import MessageInputField from "@/src/chat/components/MessageInputField";
import useLLM from "@/src/chat/hooks/useLLM";
import rollToBottom from '@/src/chat/utils/rollToTheBottom';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Stack } from "expo-router";
import { useRef } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

export default function ChatLayout() {

    const headerTint = useThemeColor('headerTint');
    const headerTintInactive = useThemeColor('headerTintInactive');

    const scrollViewRef = useRef<Animated.ScrollView>(null);
    const { messages, sendMessage, isUnableToSend, reload } = useLLM({
        onMessagesUpdate: () => rollToBottom(scrollViewRef)
    })
    const headerHeight = useHeaderHeight()

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
                    <View style={{ height: headerHeight }} />
                    {
                        messages.map((message, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.bubbleContainer,
                                    message.message.role === 'user' ? styles.userBubbleContainer : styles.systemBubbleContainer
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
                        onPress={() => rollToBottom(scrollViewRef)}
                    />
                </View>
            </KeyboardAvoidingView>
            <Stack.Screen
                options={{
                    headerRight: () => 
                        <RectButton onPress={reload}>
                            <MaterialCommunityIcons 
                                name="reload" 
                                color={isUnableToSend? 
                                    headerTintInactive: headerTint
                                } 
                                size={20} 
                                onPress={isUnableToSend? () => null: reload} 
                            />
                        </RectButton>
                }}
            />
        </ThemedSafeAreaView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
