import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native"

const { width, height } = Dimensions.get("window")

type OverlayedLoadingScreenProps = {
    isVisible: boolean
}

export default function OverlayedLoadingScreen({isVisible}: OverlayedLoadingScreenProps) {
    
    if(!isVisible)
        return null
    
    return (
        <View style = {styles.mainContainer}>
            <ActivityIndicator size = {20} color = "white"/>
        </View>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        width, height,
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
})