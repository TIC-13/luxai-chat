import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ThemedText, ThemedTextProps } from "../../ThemedText";
import { ThemedView, ThemedViewProps } from "../../ThemedView";

export function Container(props: ThemedViewProps) {
    return (
        <ThemedView
            {...props}
            style={[styles.container, props.style]}
        />
    )
}

export function ContainerIconView(props: ViewProps) {
    return (
        <View
            {...props}
            style={[styles.iconContainer, props.style]}
        />
    )
}

export function ContainerContentView(props: ViewProps) {
    return (
        <View
            {...props}
            style={[styles.contentContainer, props.style]}
        />
    )
}

export function ContainerTitle(props: ThemedTextProps) {
    return (
        <ThemedText
            {...props}
            style={[styles.title, props.style]}
        />
    )
}

export function ContainerText(props: ThemedTextProps) {
    return (
        <ThemedText
            {...props}
            style={[styles.text, props.style]}
        />
    )
}

export function ContainerIcon(props: ComponentProps<typeof MaterialCommunityIcons>) {
    return (
        <MaterialCommunityIcons size={20} {...props} />
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: "100%",
        paddingVertical: 20,
        paddingHorizontal: 5,
        borderRadius: 20
    },

    iconContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    contentContainer: {
        flex: 3,
        justifyContent: 'space-between',
        rowGap: 5,
    },

    title: {
        fontSize: 15,
        fontWeight: '500'
    },

    text: {
        fontSize: 12,
        fontWeight: '300',
        lineHeight: 20,
    }
})