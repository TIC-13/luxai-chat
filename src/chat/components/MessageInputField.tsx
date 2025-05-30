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

    const canSubmit = !isLoading && text !== ""

    const submitText = () => {

        if (!canSubmit) return

        onSend(text)
        onChangeText("")
    }

    return (
        <View style={[styles.inputContainer, { backgroundColor }]}>
            <TextInput
                placeholder="Write your text here..."
                placeholderTextColor={placeholderTextColor}
                value={text}
                onChangeText={onChangeText}
                onSubmitEditing={submitText}
                style={{ flex: 1, color: textColor }}
                onPress={onPress}
                submitBehavior="submit"
            />
            <Pressable
                style={[styles.sendIconContainer, { backgroundColor: iconContainer }]}
                onPress={submitText}
                android_ripple={{ color: backgroundColor }}
            >
                {
                    isLoading ?
                        <ActivityIndicator color={iconColor} size={20} /> :
                        <MaterialCommunityIcons name="send" color={iconColor} size={20} />
                }
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center',
        width: "100%",
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },
    sendIconContainer: {
        //height: "100%",
        padding: 10,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center"
    }
})