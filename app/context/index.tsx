import HTML from "@/components/HTML";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRagContext } from "@/contexts/RagContext";
import useParseMarkdownToHTML from "@/src/context/hooks/useParseMarkdownToHTML";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function ContextModal() {

    const { ragContexts } = useRagContext()

    const parsedContexts = useMemo(() => ragContexts.map(context => context.slice(3)), [ragContexts])

    const parsedMarkdown = useParseMarkdownToHTML(parsedContexts)

    if (parsedMarkdown === undefined)
        return <LoadingScreen />

    return (
        <ThemedView style={{ flex: 1 }}>
            <Animated.ScrollView style={styles.mainContainer}>
                {
                    parsedMarkdown !== undefined &&
                    parsedMarkdown.map((markdown, index) => {
                        return (
                            <View key={index} style={{ flex: 1 }}>
                                <ThemedText
                                    style={styles.contextIndexText}
                                >
                                    {`Context ${index + 1}`}
                                </ThemedText>
                                <HTML>
                                    {markdown}
                                </HTML>
                            </View>
                        )
                    })
                }
                <View style={{ height: 70 }} />
            </Animated.ScrollView>
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    contextIndexText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        marginVertical: 20
    }
})
