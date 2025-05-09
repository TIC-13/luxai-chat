import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useRagContext } from "@/contexts/RagContext";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function ContextModal() {
    
    const { ragContexts } = useRagContext()
    
    return (
        <ThemedView style = {{flex: 1}}>
            <Animated.ScrollView style = {styles.mainContainer}>
            {
                ragContexts.map((context, index) => {
                    return (
                        <View key = {index} style = {{flex: 1}}>
                            <ThemedText>{context}</ThemedText>
                        </View>
                    )
                })
            }
            <View style = {{height: 70}}/>
            </Animated.ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingTop: 10,
        paddingHorizontal: 20,
    }
})