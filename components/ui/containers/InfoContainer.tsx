import { ThemedTextProps } from "@/components/ThemedText";
import { ThemedViewProps } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { Container, ContainerIcon, ContainerText, ContainerTitle } from "./Container";

export function InfoContainer(props: ThemedViewProps) {
    const infoBackground = useThemeColor('infoCardBackground');
    return (
        <Container
            {...props}
            style={[{ backgroundColor: infoBackground }, props.style]}
        />
    );
}

export function InfoContainerTitle(props: ThemedTextProps) {
    const infoTitle = useThemeColor('infoCardTitleTint');
    return (
        <ContainerTitle
            {...props}
            style={[{ color: infoTitle }, props.style]}
        />
    );
}

export function InfoContainerText(props: ThemedTextProps) {
    const infoText = useThemeColor('infoCardTextTint');
    return (
        <ContainerText
            {...props}
            style={[{ color: infoText }, props.style]}
        />
    );
}

export function InfoContainerIcon(props: ComponentProps<typeof MaterialCommunityIcons>) {
    const infoIcon = useThemeColor('infoCardIconTint');
    return (
        <ContainerIcon size={20} color={infoIcon} {...props} />
    );
}