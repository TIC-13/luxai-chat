import { useThemeColor } from "@/hooks/useThemeColor"
import { ActivityIndicator } from "react-native"
import { ThemedView } from "./ThemedView"

export default function LoadingScreen() {

    const activityIndicatorColor = useThemeColor('activityIndicator')

    return (
        <ThemedView style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
        }}
        >
            <ActivityIndicator 
                size={30}
                color = {activityIndicatorColor}
            />
        </ThemedView>
    )
}