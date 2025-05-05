import { Message } from "@/app/chat/types/message";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { KeyboardAvoidingView, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import MessageBubble from "./components/MessageBubble";
import MessageInputField from "./components/MessageInputField";

export default function ChatLayout() {
    return (
        <ThemedSafeAreaView style = {{flex: 1}}>
            <KeyboardAvoidingView style={styles.mainContainer}>
                <Animated.ScrollView style={styles.bubblesContainer}>
                    {
                        messages.map((message, index) => (
                            <View
                                style={[
                                    styles.bubbleContainer,
                                    message.sender === 'user' ? styles.userBubbleContainer : styles.systemBubbleContainer
                                ]}
                            >
                                <MessageBubble key={index} message={message} />
                            </View>
                        ))
                    }
                    <View style = {{height: 15}}/>
                </Animated.ScrollView>
                <View style={styles.messageInputContainer}>
                    <MessageInputField />
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
        paddingTop: 20
    },
    bubblesContainer: {
        rowGap: 10,
        paddingHorizontal: 20,
        width: '100%',
        flex: 1,
        //justifyContent: "center",
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
        justifyContent: "center",
        alignItems: "center",
    }
})

const messages: Message[] = [
    { sender: 'user', text: 'Hello!' },
    { sender: 'system', text: 'Hi there!' },
    { sender: 'user', text: 'How are you?' },
    { sender: 'system', text: 'I am fine, thank you!' },
    { sender: 'user', text: 'What about you?' },
    { sender: 'system', text: 'I am just a computer program, so I don\'t have feelings.' },
    { sender: 'user', text: 'Hello!' },
    { sender: 'system', text: 'Hi there!' },
    { sender: 'user', text: 'How are you?' },
    { sender: 'system', text: 'I am fine, thank you!' },
    { sender: 'user', text: 'What about you?' },
    { sender: 'system', text: 'I am just a computer program, so I don\'t have feelings.' },
]