import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRagContext } from "@/contexts/RagContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { parseMarkdownImages } from "@/src/download/utils/markdownImagesUtils";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Markdown from "react-native-markdown-display";
import Animated from "react-native-reanimated";

export default function ContextModal() {

    const { ragContexts } = useRagContext()
    const textColor = useThemeColor('text');


    const [parsedContexts, setParsedContexts] = useState<string[] | undefined>(undefined)

    useEffect(() => {
        fullParse().then(res => setParsedContexts(res))
    }, [])

    async function fullParse() {
        const firstParse = ragContexts.map( context => parseContext(context) )
        const finalParse: string[] = []

        for(let context of firstParse) {
            const parsed = await parseMarkdownImages(context)
            finalParse.push(parsed)
        }

        return finalParse
    }

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
                                    {`Context ${index+1}`}
                                </ThemedText>
                                <Markdown style = {{
                                    body: { color: textColor },
                                    image: {  maxWidth: 20, maxHeight: 20, margin: 10 },
                                }}>
                                    {context}
                                </Markdown>
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
        paddingTop: 100,
        paddingHorizontal: 20,
    }
})

function parseContext(input: string): string {
    const formatted = input
        .slice(3)
    let lines = formatted.split('\\n');
    let linesConcatenated = lines[0]

    lines.slice(1).map(line => {
        linesConcatenated += `\n${line.trim()}`
    })

    console.log("ORIGINAL", input)
    console.log('PARSED', linesConcatenated)

    return linesConcatenated;
}
