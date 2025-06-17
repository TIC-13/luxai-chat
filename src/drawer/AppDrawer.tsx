import { AppVersion } from "@/app.config";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as Crypto from "expo-crypto";
import { router } from "expo-router";
import { ComponentProps, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { conversations } from "../chat/utils/storeConversations";

export default function AppDrawer() {
    const [showItemCount, setShowItemCount] = useState(7);
    const headerBackground = useThemeColor('headerBackground');
    const headerTint = useThemeColor('headerTint');

    const history = conversations.values().reverse();
    const hasMoreItems = history.length > showItemCount;
    const isShowingMore = showItemCount > 7;

    return (
        <DrawerContentScrollView>
            <ThemedView style={[styles.header, { backgroundColor: headerBackground }]}>
                <ThemedText style={[styles.headerTitle, { color: headerTint }]}>
                    {AppVersion.name}
                </ThemedText>
            </ThemedView>

            <DrawerSection>
                <DrawerItem
                    label="New Chat"
                    icon="plus"
                    withBackground={true}
                    onPress={() => router.navigate({
                        pathname: "/chat/[id]",
                        params: { id: Crypto.randomUUID() }
                    })}
                />

                {history.slice(0, showItemCount).map((conversation, idx) => (
                    <DrawerItem
                        key={idx}
                        label={conversation.title}
                        onPress={() => router.navigate({
                            pathname: "/chat/[id]",
                            params: { id: conversation.id }
                        })}
                    />
                ))}

                {hasMoreItems && (
                    <DrawerItem
                        label="Show More"
                        icon="chevron-down"
                        onPress={() => setShowItemCount(prev => prev + 7)}
                    />
                )}

                {isShowingMore && (
                    <DrawerItem
                        label="Show Less"
                        icon="chevron-up"
                        onPress={() => setShowItemCount(7)}
                    />
                )}
            </DrawerSection>
        </DrawerContentScrollView>
    );
}

function DrawerSection({ children }: { children: React.ReactNode }) {
    return (
        <View style={styles.section}>
            {children}
        </View>
    );
}

function DrawerItem({
    label,
    icon,
    onPress,
    withBackground = false
}: {
    label: string;
    icon?: ComponentProps<typeof MaterialCommunityIcons>["name"];
    onPress?: () => void;
    withBackground?: boolean;
}) {
    const iconColor = useThemeColor('icon');
    const headerBackground = useThemeColor('headerBackground');
    const itemBackground = useThemeColor('drawerItemBackground');

    return (
        <Pressable
            style={[
                styles.item,
                withBackground && { 
                    backgroundColor: itemBackground,
                    marginHorizontal: 0,
                    borderRadius: 8
                }
            ]}
            onPress={onPress}
            android_ripple={{ color: headerBackground }}
        >
            {icon !== undefined && (
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={iconColor}
                    style = {{ marginRight: 12 }}
                />
            )}
            <ThemedText style={styles.itemLabel} numberOfLines={1}>
                {label}
            </ThemedText>
        </Pressable>
    );
}

// ...existing styles remain the same...

const styles = StyleSheet.create({
    header: {
        padding: 16,
        marginBottom: 8,
        fontWeight: '600',
        borderRadius: 8
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600'
    },
    section: {
        marginTop: 8,
        paddingTop: 10,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#ccc'
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginVertical: 4
    },
    itemLabel: {
        //marginLeft: 32,
        fontSize: 16
    }
});