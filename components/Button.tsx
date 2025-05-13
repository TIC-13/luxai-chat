import { useThemeColor } from "@/hooks/useThemeColor"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ComponentProps } from "react"
import { Pressable, PressableProps, StyleSheet, TextProps, TextStyle, ViewStyle } from "react-native"
import { ThemedText } from "./ThemedText"

type ButtonProps = PressableProps & {
    style?: ViewStyle,
}

export default function Button(props: ButtonProps) {

    const buttonColor = useThemeColor('buttonBackground')
    const backgroundColor = useThemeColor('background')

    return (
        <Pressable
            android_ripple={{ color: backgroundColor }}
            {...props}    
            style={[styles.button, { backgroundColor: buttonColor }, props.style]}
        />
    )
}

type ButtonTextProps = TextProps & {
    style?: TextStyle,
}

export function ButtonText(props: ButtonTextProps) {

    const labelColor = useThemeColor('buttonLabel')

    return (
        <ThemedText 
            {...props} 
            style={[styles.buttonLabel, {color: labelColor}, props.style]}
        />
    )
}

export function ButtonIcon(props: ComponentProps<typeof MaterialCommunityIcons>) {

    const labelColor = useThemeColor('buttonLabel')

    return (
        <MaterialCommunityIcons color={labelColor} size = {15} {...props}/>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        columnGap: 10,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 10
    },
    buttonLabel: {
        fontSize: 14
    }
})