import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet } from "react-native";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";

export function HeaderIconContainer(props: RectButtonProps) {
    return (
        <RectButton
            {...props}
            style={[styles.headerIconContainer, props.style]}
        />
    )
}

export function HeaderIcon(props: ComponentProps<typeof MaterialCommunityIcons> & { active: boolean }) {
    
    const headerTint = useThemeColor('headerTint');
    const headerTintInactive = useThemeColor('headerTintInactive');
    
    return (
        <MaterialCommunityIcons
            color={props.active ?
                headerTint : headerTintInactive
            }
            size={20}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    headerIconContainer: {
        width: 60,
        height: "100%",
        justifyContent: 'center',
        alignItems: 'center'
    },
})