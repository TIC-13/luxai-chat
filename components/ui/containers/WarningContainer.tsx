import { ThemedTextProps } from "@/components/ThemedText";
import { ThemedViewProps } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { Container, ContainerIcon, ContainerText, ContainerTitle } from "./Container";

export function WarningContainer(props: ThemedViewProps) {
    const warningBackground = useThemeColor('warningCardBackground');
    return (
        <Container
            {...props}
            style={[{ backgroundColor: warningBackground }, props.style]}
        />
    );
}

export function WarningContainerTitle(props: ThemedTextProps) {
    const warningTitle = useThemeColor('warningCardTitleTint');
    return (
        <ContainerTitle
            {...props}
            style={[{ color: warningTitle }, props.style]}
        />
    );
}

export function WarningContainerText(props: ThemedTextProps) {
    const warningText = useThemeColor('warningCardTextTint');
    return (
        <ContainerText
            {...props}
            style={[{ color: warningText }, props.style]}
        />
    );
}

export function WarningContainerIcon(props: ComponentProps<typeof MaterialCommunityIcons>) {
    const warningIcon = useThemeColor('warningCardIconTint');
    return (
        <ContainerIcon color={warningIcon} {...props} />
    );
}