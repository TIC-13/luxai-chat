import { AppVersion } from "@/app.config";
import { HeaderIcon, HeaderIconContainer } from "@/components/chat/components/HeaderIcon";
import { KeyboardSpacer } from "@/components/KeyboardSpacer";
import LoadingScreen from "@/components/LoadingScreen";
import { ModalBackdrop, ModalButton, ModalButtonContainer, ModalContainer, ModalFooter, ModalHeader, ModalText, ModalTitle, MyModal } from "@/components/Modal";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import MessageBubble from "@/src/chat/components/MessageBubble";
import MessageInputField from "@/src/chat/components/MessageInputField";
import useLLM from "@/src/chat/hooks/useLLM";
import { LLMMessage } from "@/src/chat/types/LLMMessage";
import rollToBottom from '@/src/chat/utils/rollToTheBottom';
import { conversations } from "@/src/chat/utils/storeConversations";
import { useGetDictionayOfImagesFromManual } from "@/src/context/hooks/useParseMarkdown";
import { ImagesDict, parseMarkdownImages } from "@/src/download/utils/markdownImagesUtils";
import useThrottle from "@/src/hooks/useThrottle";
import { useHeaderHeight } from "@react-navigation/elements";
import { DrawerActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { useRef, useState } from "react";
import { Platform, StyleSheet, ToastAndroid, View } from "react-native";
import Animated from "react-native-reanimated";
import Toast from "react-native-toast-message";
import { startNewChat } from "../../(download)";

export default function ChatLayout() {

    const scrollViewRef = useRef<Animated.ScrollView>(null);

    const { id } = useLocalSearchParams<{ id: string }>()
    const { messages, sendMessage, isUnableToSend } = useLLM({
        conversationId: id,
        onMessagesUpdate: () => rollToBottom(scrollViewRef)
    })

    const imagesDict = useGetDictionayOfImagesFromManual()

    const headerHeight = useHeaderHeight()
    const navigation = useNavigation()

    const throttledCantDoActionToast = useThrottle(showYouCantDoThatToast, 0)

    const [deleteModalVisible, setDeleteModalVisible] = useState(false);

    const canSend = !isUnableToSend
    const chatExists = messages.length > 0

    const headerIconCallback = (callback: () => void, message?: string) =>
        () => canSend ? callback() : throttledCantDoActionToast(message)

    if (imagesDict === undefined)
        return <LoadingScreen />

    return (
        <ThemedSafeAreaView style={{ flex: 1 }}>
            <View
                style={styles.mainContainer}
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
                <KeyboardSpacer/>
                <DeleteConversationModal />
            </View>
            <Drawer.Screen
                options={{
                    headerTitle: AppVersion.name,
                    headerLeft: () => (
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
                    ),

                    headerRight: () =>
                        <View style={{ flexDirection: 'row', height: "100%" }}>

                            <HeaderIconContainer
                                onPress={chatExists? headerIconCallback(startNewChat): () => null}
                            >
                                <HeaderIcon
                                    name="plus"
                                    active={canSend && chatExists}
                                />
                            </HeaderIconContainer>

                            <HeaderIconContainer
                                onPress={chatExists ? headerIconCallback(() => setDeleteModalVisible(true)): () => null}
                            >
                                <HeaderIcon
                                    name="trash-can"
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
            <MyModal visible={deleteModalVisible}>
                <ModalBackdrop>
                    <ModalContainer>
                        <ModalHeader>
                            <ModalTitle>Delete conversation</ModalTitle>
                        </ModalHeader>

                        <ModalText>
                            Are you sure you want to delete this conversation?
                        </ModalText>

                        <ModalFooter>
                            <ModalButtonContainer>
                                <ModalButton
                                    variant="secondary"
                                    title="Cancel"
                                    onPress={() => setDeleteModalVisible(false)}
                                />
                                <ModalButton
                                    variant="danger"
                                    title="Delete"
                                    onPress={() => {
                                        startNewChat()
                                        conversations.remove(id)
                                        setDeleteModalVisible(false)
                                    }}
                                />
                            </ModalButtonContainer>
                        </ModalFooter>
                    </ModalContainer>
                </ModalBackdrop>
            </MyModal>
        )
    }
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
    }
})
