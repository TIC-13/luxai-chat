import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";

type MessageInputFieldProps = {
    isLoading: boolean,
    onSend: (prompt: string) => void,
    onPress?: () => void
}

export default function MessageInputField({ isLoading, onSend, onPress }: MessageInputFieldProps) {

    const backgroundColor = useThemeColor('messageInputField')
    const placeholderTextColor = useThemeColor('placeholderTextColor')
    const textColor = useThemeColor('text')
    const iconContainer = useThemeColor('iconContainer')
    const iconColor = useThemeColor('iconColor')

    const [text, onChangeText] = useState<string>("")

    const submitText = () => {
        onSend(text)
        onChangeText("")
    }

    return (
        <View style={[styles.inputContainer, { backgroundColor }]}>
            <TextInput
                placeholder="Write your text here..."
                placeholderTextColor={placeholderTextColor}
                value = {text}
                onChangeText={onChangeText}
                onSubmitEditing={submitText}
                style={{ flex: 1, color: textColor }}
                onPress={onPress}
            />
            <View style={[styles.sendIconContainer, { backgroundColor: iconContainer }]}>
                {
                    isLoading ?
                        <ActivityIndicator color={iconColor} size={20} /> :
                        <Pressable
                            android_ripple={{ color: iconContainer }}
                            onPress={submitText}
                        >
                            <MaterialCommunityIcons name="send" color={iconColor} size={20} />
                        </Pressable>

                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 25,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    sendIconContainer: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center"
    }
})