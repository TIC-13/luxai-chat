import { AppVersion } from "@/app.config";
import { HeaderIcon, HeaderIconContainer } from "@/components/chat/components/HeaderIcon";
import { KeyboardSpacer } from "@/components/KeyboardSpacer";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import ChoiceModal from "@/components/ui/modal/ChoiceModal";
import OverlayedLoadingScreen from "@/components/ui/OverlayedLoadingScreen";
import usePost from "@/hooks/usePost";
import { useThemeColor } from "@/hooks/useThemeColor";
import MessageBubble from "@/src/chat/components/MessageBubble";
import MessageInputField from "@/src/chat/components/MessageInputField";
import useLLM from "@/src/chat/hooks/useLLM";
import { LLMMessage } from "@/src/chat/types/LLMMessage";
import rollToBottom from '@/src/chat/utils/rollToTheBottom';
import { conversations } from "@/src/chat/utils/storeConversations";
import { markdownFullParse, useGetDictionayOfImagesFromManual } from "@/src/context/hooks/useParseMarkdownToHTML";
import { ImagesDict } from "@/src/download/utils/markdownImagesUtils";
import useThrottle from "@/src/hooks/useThrottle";
import { useHeaderHeight } from "@react-navigation/elements";
import { DrawerActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { useState } from "react";
import { Platform, StyleSheet, Text, TextProps, ToastAndroid, View } from "react-native";
import Animated, { FadeIn, FadeOut, useAnimatedRef } from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { startNewChat } from "../../(download)";

interface Report {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
}

interface CreateReportParams {
    content: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export default function ChatLayout() {

    const animatedScrollRef = useAnimatedRef<Animated.ScrollView>()

    const { id } = useLocalSearchParams<{ id: string }>()
    const { messages, sendMessage, isUnableToSend, isDecoding } = useLLM({
        conversationId: id,
        onMessagesUpdate: () => rollToBottom(animatedScrollRef)
    })

    const imagesDict = useGetDictionayOfImagesFromManual()

    const headerHeight = useHeaderHeight()
    const navigation = useNavigation()

    const throttledCantDoActionToast = useThrottle(showYouCantDoThatToast, 0)

    const [deleteModalVisible, setDeleteModalVisible] = useState(false)
    const [reportModalVisible, setReportModalVisible] = useState(false)

    const {
        execute: sendReport,
        isLoading: isSendingReport,
    } = usePost<ApiResponse<Report>, CreateReportParams>(
        `${process.env.EXPO_PUBLIC_API_URL}/reports`,
        {
            onSuccess: (response, params) => {
                console.log('Report created successfully:', response.data);
                console.log('Original content:', params.content);
                Toast.show({ type: "success", text1: "Report sent", text2: "Report sent successfully" })
            },
            onError: (error, params) => {
                console.error('Failed to create report:', error.message);
                console.error('Content that failed:', params.content);
                Toast.show({ type: "error", text1: "Error reporting", text2: "Error sending report" })
            }
        }
    )

    const canSend = !isUnableToSend
    const chatExists = messages.length > 0

    const headerIconCallback = (callback: () => void, message?: string) =>
        () => canSend ? callback() : throttledCantDoActionToast(message)

    if (imagesDict === undefined)
        return <LoadingScreen />

    return (
        <ThemedSafeAreaView style={{ flex: 1 }}>
            <OverlayedLoadingScreen isVisible={isSendingReport} />
            <View
                style={styles.mainContainer}
            >
                {
                    chatExists ?
                        <Animated.ScrollView
                            ref={animatedScrollRef}
                            style={styles.bubblesContainer}
                        >
                            <View style={{ height: headerHeight }} />
                            {
                                messages.map((message, index) => {

                                    const isLast = index === messages.length - 1
                                    const answerInProgress = isDecoding && isLast

                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.bubbleContainer,
                                                message.message.role === 'user' ? styles.userBubbleContainer : styles.systemBubbleContainer
                                            ]}
                                        >
                                            <MessageBubble
                                                key={index}
                                                message={
                                                    message.message.role === "user" ?
                                                        message :
                                                        parseMessageWithMarkdownImages(message, imagesDict)
                                                }
                                                isDecoding={answerInProgress}
                                                onRerender={isLast? () => rollToBottom(animatedScrollRef): undefined}
                                            />
                                        </View>
                                    )
                                })
                            }
                            <View style={{ height: 15 }} />
                        </Animated.ScrollView> :

                        <ChatWarnings />
                }
                <View style={styles.messageInputContainer}>
                    <MessageInputField
                        isLoading={isUnableToSend}
                        onSend={(prompt) => {
                            sendMessage(prompt)
                        }}
                        onPress={() => rollToBottom(animatedScrollRef)}
                    />
                </View>
                <KeyboardSpacer />
                <DeleteConversationModal />
                <ReportConversationModal />
            </View>
            <Drawer.Screen
                options={{
                    headerTitle: AppVersion.name,
                    headerLeft: () =>
                        <View style={{ flexDirection: 'row', height: "100%" }}>
                            <HeaderIconContainer
                                onPress={
                                    headerIconCallback(() => navigation.dispatch(DrawerActions.openDrawer()),
                                        "Wait until the app finishes answering"
                                    )}
                            >
                                <HeaderIcon
                                    name="menu"
                                    active={canSend}
                                />
                            </HeaderIconContainer>

                            <HeaderIconContainer
                                onPress={chatExists ? headerIconCallback(startNewChat) : () => null}
                            >
                                <HeaderIcon
                                    name="plus"
                                    active={canSend && chatExists}
                                />
                            </HeaderIconContainer>


                        </View>,

                    headerRight: () =>
                        <View style={{ flexDirection: 'row', height: "100%" }}>


                            <HeaderIconContainer
                                onPress={chatExists ? headerIconCallback(() => setDeleteModalVisible(true)) : () => null}
                            >
                                <HeaderIcon
                                    name="trash-can"
                                    active={canSend && chatExists}
                                />
                            </HeaderIconContainer>


                            <HeaderIconContainer
                                onPress={chatExists ? headerIconCallback(() => setReportModalVisible(true)) : () => null}
                            >
                                <HeaderIcon
                                    name="alert"
                                    active={canSend && chatExists}
                                />
                            </HeaderIconContainer>

                        </View>
                }}
            />
        </ThemedSafeAreaView >
    )

    function DeleteConversationModal() {
        return (
            <ChoiceModal
                title="Delete conversation"
                content="Are you sure you want to delete this conversation?"
                isVisible={deleteModalVisible}
                close={() => setDeleteModalVisible(false)}
                buttonsProps={[
                    {
                        variant: "danger",
                        title: "Delete",
                        onPress: () => {
                            startNewChat()
                            conversations.remove(id)
                        }
                    }
                ]}
            />
        )
    }

    function ReportConversationModal() {
        return (
            <ChoiceModal
                title="Report conversation"
                content="Are you sure you want to report this conversation?"
                isVisible={reportModalVisible}
                close={() => setReportModalVisible(false)}
                buttonsProps={[
                    {
                        variant: "danger",
                        title: "Report",
                        onPress: () => {
                            sendReport({ content: getConversationString(messages) })
                        }
                    }
                ]}
            />
        )
    }
}

function ChatWarnings() {

    const subtleTextColor = useThemeColor("headerTintInactive")

    function SubtleText(props: TextProps) {
        return <Text {...props} style={[{ color: subtleTextColor }, props.style]} />
    }

    return (
        <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '80%', rowGap: 15 }}
        >
            <View style={{ height: 50 }} />
            <SubtleText>LLM responses may contain errors, so it's wise to verify them.</SubtleText>
            <SubtleText>LLM inference on less powerful mobile devices can lead to slowdowns and freezes.</SubtleText>
        </Animated.View>
    )
}

function showYouCantDoThatToast(message: string = "Wait until the app finishes answering") {
    if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(message, 1000, ToastAndroid.TOP)
        return
    }
    Toast.show({
        type: 'info',
        text1: "You can't do that right now",
        text2: "Wait until the app finishes answering",
    })
}

function parseMessageWithMarkdownImages(message: LLMMessage, imagesDict: ImagesDict) {
    return { ...message, message: { ...message.message, content: markdownFullParse([message.message.content], imagesDict)[0] } }
}

function getConversationString(messages: LLMMessage[]) {
    let finalString = ""
    for (let { message } of messages) {
        const { role, content } = message
        finalString += `<${role}>${content}</${role}>`
    }
    return finalString
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
