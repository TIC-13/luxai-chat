import Button, { ButtonIcon, ButtonText } from "@/components/Button";
import LoadingScreen from "@/components/LoadingScreen";
import { ThemedSafeAreaView } from "@/components/ThemedSafeAreaView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ContainerContentView, ContainerIconView } from "@/components/ui/containers/Container";
import { InfoContainer, InfoContainerIcon, InfoContainerText, InfoContainerTitle } from "@/components/ui/containers/InfoContainer";
import LoadingModal from "@/components/ui/modal/LoadingModal";
import ProceedModal from "@/components/ui/modal/ProceedModal";
import { DOWNLOADS } from "@/constants/Files";
import { useThemeColor } from "@/hooks/useThemeColor";
import useCheckIfAllFilesDownloaded from "@/src/download/hooks/useCheckIfAllFilesDownloaded";
import useSequentialDownload from "@/src/download/hooks/useSequentialDownload";
import * as Crypto from "expo-crypto";
import { Image } from 'expo-image';
import * as Notifications from 'expo-notifications';
import { router } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import * as Progress from 'react-native-progress';
import Toast from "react-native-toast-message";

const { width } = Dimensions.get("window")

export default function DonwnloadScreen() {
    const [downloadStarted, setDownloadStarted] = useState(false);
    const [showNotificationPermissionModal, setShowNotificationPermissionModal] = useState(false)

    const allFilesDownloaded = useCheckIfAllFilesDownloaded({
        onTrue: startNewChat
    })

    if (allFilesDownloaded === undefined)
        return <LoadingScreen />

    async function onPressStartDownload() {
        const notificationPermission = await allowsNotificationsAsync()
        if (notificationPermission) {
            setDownloadStarted(true)
            return
        }
        setShowNotificationPermissionModal(true)
    }

    return (
        <ThemedSafeAreaView style={styles.safeArea}>

            <View style={styles.contentContainer}>
                <View style={styles.downloadArea}>
                    <Image
                        source={require("@/assets/images/download_light.png")}
                        style={{ width: 170, height: 170 }}
                    />
                    <ThemedText style={[styles.headerSubtitle, { width: "40%" }]}>
                        Before we begin, we need to download AI models for the app to function
                    </ThemedText>
                </View>
                <View style={styles.downloadButtonContainer}>
                    {
                        downloadStarted ?
                            <DownloadModels /> :
                            <Button
                                onPress={onPressStartDownload}
                            >
                                <ButtonIcon name="download" />
                                <ButtonText>Start downloads</ButtonText>
                            </Button>
                    }
                </View>
            </View>

            <View style={styles.warningArea}>
                <InfoContainer>
                    <ContainerIconView>
                        <InfoContainerIcon name="information" />
                    </ContainerIconView>
                    <ContainerContentView>
                        <InfoContainerTitle>Warning</InfoContainerTitle>
                        <InfoContainerText>The downloads are very large, beware of using mobile data</InfoContainerText>
                    </ContainerContentView>
                </InfoContainer>
            </View>

            <BeforeStartDownloadModal />

        </ThemedSafeAreaView>
    );

    function BeforeStartDownloadModal() {
        return (
            <ProceedModal
                title="Notification permission"
                content="We'll ask for permission to send you notifications so we can keep you updated on the download status."
                close={() => setShowNotificationPermissionModal(false)}
                isVisible={showNotificationPermissionModal}
                onConfirm={() => setDownloadStarted(true)}
            />
        )
    }
}

function DownloadModels() {

    const onError = () => {
        Toast.show({
            type: 'error',
            text1: 'Download failed',
            text2: "Press 'Retry Download' to try again",
        })
    }

    const { overallProgress, currentFileName, error, retry } = useSequentialDownload({
        downloads: DOWNLOADS,
        onAllFinished: startNewChat,
        onError
    })

    const isProcessingDownloads = currentFileName === null

    const progressBarFilledColor = useThemeColor('progressBarFilled')
    const progressBarUnfilledColor = useThemeColor('progressBarUnfilled')

    return (
        <ThemedView
            style={styles.downloadContainer}
        >
            {
                error === undefined ?
                    <>
                        <ThemedText style={styles.progressFileName}>
                            {
                                currentFileName === null ?
                                    "Preparing downloads..." :
                                    `Downloading ${currentFileName}`
                            }
                        </ThemedText>
                        {
                            !isProcessingDownloads &&
                            <Progress.Bar
                                progress={overallProgress}
                                width={width * 0.8}
                                height={10}
                                color={progressBarFilledColor}
                                unfilledColor={progressBarUnfilledColor}
                                borderWidth={0}
                            />
                        }
                    </> :
                    <Button
                        onPress={retry}
                    >
                        <ButtonIcon name='restart' />
                        <ButtonText>Retry download</ButtonText>
                    </Button>
            }
            <LoadingModal
                isVisible={isProcessingDownloads}
                content="Processing downloads — please stay in the app."
            />
        </ThemedView>
    )
}

export const startNewChat = () =>
    router.replace({ pathname: "/chat/[id]", params: { id: Crypto.randomUUID() } })

export async function allowsNotificationsAsync() {
    const settings = await Notifications.getPermissionsAsync();
    return (
        settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    contentContainer: {
        //flex: 5, 
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 30
    },
    downloadArea: {
        flexDirection: 'row',
        width: "100%",
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
    },
    headerSubtitle: {
        fontSize: 14,
        fontWeight: '300'
    },
    warningArea: {
        //flex: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadContainer: {
        //flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 20,
    },
    progressContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        rowGap: 10,
    },
    progressFileName: {
        fontSize: 12,
    },
    retryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    downloadButtonContainer: {
        height: 70,
        justifyContent: 'flex-start',
        alignItems: 'center'
    }
});