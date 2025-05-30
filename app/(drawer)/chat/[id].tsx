import LoadingScreen from "@/components/LoadingScreen";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { useThemeColor } from "@/hooks/useThemeColor";
import MessageBubble from "@/src/chat/components/MessageBubble";
import MessageInputField from "@/src/chat/components/MessageInputField";
import useLLM from "@/src/chat/hooks/useLLM";
import { LLMMessage } from "@/src/chat/types/LLMMessage";
import rollToBottom from '@/src/chat/utils/rollToTheBottom';
import { useGetDictionayOfImagesFromManual } from "@/src/context/hooks/useParseMarkdown";
import { ImagesDict, parseMarkdownImages } from "@/src/download/utils/markdownImagesUtils";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { DrawerActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { useRef } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { startNewChat } from "../../(download)";

export default function ChatLayout() {

    const headerTint = useThemeColor('headerTint');
    const headerTintInactive = useThemeColor('headerTintInactive');

    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const { id } = useLocalSearchParams<{ id: string }>()
    const { messages, sendMessage, isUnableToSend } = useLLM({
        conversationId: id,
        onMessagesUpdate: () => rollToBottom(scrollViewRef)
    })

    const imagesDict = useGetDictionayOfImagesFromManual()

    const headerHeight = useHeaderHeight()
    const navigation = useNavigation()

    if (imagesDict === undefined)
        return <LoadingScreen />

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
                                <MessageBubble key={index} message={parseMessageWithMarkdownImages(message, imagesDict)} />
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
            <Drawer.Screen
                options={{

                    headerTitle: "LuxAI Chat",

                    headerLeft: () => (
                        <RectButton
                            onPress={isUnableToSend ? showCantDoActionToast : () => navigation.dispatch(DrawerActions.openDrawer())}
                            style={styles.headerIconContainer}
                        >
                            <MaterialCommunityIcons
                                name="menu"
                                color={isUnableToSend ?
                                    headerTintInactive : headerTint
                                }
                                size={20}
                            />
                        </RectButton>
                    ),

                    headerRight: () =>
                        <RectButton
                            onPress={isUnableToSend ? showCantDoActionToast : startNewChat}
                            style={styles.headerIconContainer}
                        >
                            <MaterialCommunityIcons
                                name="plus"
                                color={isUnableToSend ?
                                    headerTintInactive : headerTint
                                }
                                size={20}
                            />
                        </RectButton>
                }}
            />
        </ThemedSafeAreaView>
    )
}

function showCantDoActionToast() {
    Toast.show({
        type: 'info',
        text1: "You can't do that right now",
        text2: "Wait for the app to finish answering the question",
    })
}

function parseMessageWithMarkdownImages(message: LLMMessage, imagesDict: ImagesDict) {
    return { ...message, message: { ...message.message, content: parseMarkdownImages(message.message.content, imagesDict) } }
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
    },
    headerIconContainer: {
        width: 60,
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    }
})
