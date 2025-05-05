import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput } from "react-native";

export default function MessageInputField() {

    const backgroundColor = useThemeColor('messageInputField')
    const placeholderTextColor = useThemeColor('placeholderTextColor')
    const textColor = useThemeColor('text')
    const iconContainer = useThemeColor('iconContainer')
    const iconColor = useThemeColor('iconColor')

    return (
        <ThemedView style = {[styles.inputContainer, {backgroundColor}]}>
            <TextInput
                placeholder="Write your text here..."
                placeholderTextColor={placeholderTextColor}
                style = {{ flex: 1, color: textColor}}
            />
            <ThemedView style = {[styles.sendIconContainer, {backgroundColor: iconContainer}]}>
                <MaterialCommunityIcons name = "send" color = {iconColor} size={20}/>
            </ThemedView>
        </ThemedView>
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