import LoadingScreen from "@/components/LoadingScreen";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRagContext } from "@/contexts/RagContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import useParseContext from "@/src/context/hooks/useParseContext";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import Animated from "react-native-reanimated";

export default function ContextModal() {

    const { ragContexts } = useRagContext()
    const textColor = useThemeColor('text');

    const parsedContexts = useParseContext(ragContexts)

    if(parsedContexts === undefined)
        return <LoadingScreen/>

    return (
        <ThemedView style={{ flex: 1 }}>
            <Animated.ScrollView style={styles.mainContainer}>
                {
                    parsedContexts !== undefined &&
                    parsedContexts.map((context, index) => {
                        return (
                            <View key={index} style={{ flex: 1 }}>
                                <ThemedText
                                    style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginBottom: 10,
                                        color: textColor,
                                        marginVertical: 20
                                    }}
                                >
                                    {`Context ${index + 1}`}
                                </ThemedText>
                                <Markdown style={{
                                    body: { color: textColor },
                                    image: {
                                        maxWidth: 150,
                                        maxHeight: 150
                                    },
                                }}>
                                    {context}
                                </Markdown>
                            </View>
                        )
                    })
                }
                <View style={{ height: 150 }} />
            </Animated.ScrollView>
        </ThemedView>
    )
}


const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 20,
    }
})
