import Button, { ButtonIcon, ButtonText } from "@/components/Button";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { DOWNLOADS } from "@/constants/Files";
import useSequentialDownload from "@/src/download/hooks/useSequentialDownload";
import { router } from "expo-router";

function DownloadModelsScreen() {

    const goToChat = () => router.replace('/chat')

    const { currentFileProgress, currentFileName, error, retry } = useSequentialDownload({
        downloads: DOWNLOADS,
        onAllFinished: goToChat
    })

    return (
        <ThemedView
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <ThemedText>{`Downloading ${currentFileName}: ${(currentFileProgress * 100).toFixed(1)}%`}</ThemedText>
            {
                error !== undefined &&
                <Button
                    onPress={retry}
                >
                    <ButtonIcon name = 'restart'/>
                    <ButtonText>Retry download</ButtonText>
                </Button>
            }
        </ThemedView>
    )
}

export default DownloadModelsScreen
