import { AppVersion } from "@/app.config";
import { checkIfFileExists, deleteDir, ensureDirExists, getUnzippedDirPath } from '@/src/download/utils/fileUtils';
import * as FileSystem from 'expo-file-system';
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { unzip } from "react-native-zip-archive";
import { storeImagesDict } from '../utils/markdownImagesUtils';
import { useDownloadProps } from './useDownload';

const DOWNLOAD_NOTIFICATION_ID = 'download-progress-notification';
const COMPLETION_NOTIFICATION_ID = 'download-completion-notification';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: true
    }),
});

const setupNotificationCategories = async () => {
    await Notifications.setNotificationCategoryAsync('download-progress', [
    ], {
        allowInCarPlay: false,
        allowAnnouncement: false,
        showTitle: true,
        showSubtitle: true,
    });

    await Notifications.setNotificationCategoryAsync('download-complete', []);
    await Notifications.setNotificationCategoryAsync('download-error', []);

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('download-progress', {
            name: 'Download Progress',
            importance: Notifications.AndroidImportance.LOW, // Low importance = less intrusive
            vibrationPattern: null, // No vibration
            sound: null, // No sound
            enableLights: false,
            enableVibrate: false,
            showBadge: false,
        });

        await Notifications.setNotificationChannelAsync('download-complete', {
            name: 'Download Complete',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
            enableLights: true,
            enableVibrate: true,
            showBadge: true,
        });

        await Notifications.setNotificationChannelAsync('download-error', {
            name: 'Download Error',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            sound: 'default',
            enableLights: true,
            enableVibrate: true,
            showBadge: true,
        });
    }
};

type useSequentialDownloadProps = {
    downloads: useDownloadProps[];
    onAllFinished?: () => void;
    onError?: () => void;
    enableBackgroundDownload?: boolean;
    showNotification?: boolean; // New prop to enable/disable notifications
};

type DownloadWithSize = useDownloadProps & {
    fileSize?: number;
};

type DownloadState = {
    currentIndex: number;
    downloads: DownloadWithSize[];
    downloadedBytes: number;
    totalBytes: number;
};


// Notification helper functions
const updateProgressNotification = async (
    currentFile: number,
    totalFiles: number,
    fileName: string,
    downloadedBytes: number,
    totalBytes: number
) => {
    try {
        const overallProgress = totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : ((currentFile - 1) / totalFiles) * 100;
        const progressText = totalBytes > 0
            ? `${formatBytes(downloadedBytes)} / ${formatBytes(totalBytes)}`
            : `${currentFile} / ${totalFiles} files`;

        await Notifications.scheduleNotificationAsync({
            identifier: DOWNLOAD_NOTIFICATION_ID,
            content: {
                title: `${AppVersion.name} - Downloading Files`,
                body: `${progressText} (${Math.round(overallProgress)}%)`,
                data: { progress: overallProgress },
                categoryIdentifier: 'download-progress',
                // Background notification settings
                sound: false,
                priority: Notifications.AndroidNotificationPriority.LOW,
            },
            trigger: null, // Show immediately
        });
    } catch (error) {
        console.error('Failed to update progress notification:', error);
    }
};

const showCompletionNotification = async () => {
    try {
        // Cancel and dismiss previous notifications
        await Notifications.cancelScheduledNotificationAsync(DOWNLOAD_NOTIFICATION_ID);
        await Notifications.cancelScheduledNotificationAsync(COMPLETION_NOTIFICATION_ID);

        await Notifications.dismissNotificationAsync(COMPLETION_NOTIFICATION_ID);
        await Notifications.dismissNotificationAsync(DOWNLOAD_NOTIFICATION_ID);

        // Show completion notification
        await Notifications.scheduleNotificationAsync({
            identifier: COMPLETION_NOTIFICATION_ID,
            content: {
                title: `${AppVersion.name} - Downloads Complete`,
                body: "All files have been downloaded successfully!",
                sound: true,
                badge: 1,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                categoryIdentifier: 'download-complete',
            },
            trigger: null,
        });
    } catch (error) {
        console.error('Failed to show completion notification:', error);
    }
};

const showErrorNotification = async () => {
    try {
        // Cancel the progress notification
        await Notifications.cancelScheduledNotificationAsync(DOWNLOAD_NOTIFICATION_ID);

        // Show error notification
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Download Failed",
                body: "An error occurred during download. Please try again.",
                sound: true,
                badge: 1,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                categoryIdentifier: 'download-error',
            },
            trigger: null,
        });
    } catch (error) {
        console.error('Failed to show error notification:', error);
    }
};

const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export default function useSequentialDownload({
    downloads,
    onAllFinished,
    onError,
    enableBackgroundDownload = false,
    showNotification = true
}: useSequentialDownloadProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const [isAllDownloaded, setIsAllDownloaded] = useState(false);
    const [currentFileProgress, setCurrentFileProgress] = useState(0);
    const [currentFileName, setCurrentFileName] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [downloadsWithSizes, setDownloadsWithSizes] = useState<DownloadWithSize[]>([]);
    const [totalBytes, setTotalBytes] = useState(0);
    const [downloadedBytes, setDownloadedBytes] = useState(0);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [isBackgroundTaskRegistered, setIsBackgroundTaskRegistered] = useState(false);

    // Request notification permissions and setup categories
    useEffect(() => {
        if (showNotification) {
            requestNotificationPermissions();
            setupNotificationCategories();
        }
    }, [showNotification]);

    const requestNotificationPermissions = async () => {
        try {
            const { status } = await Notifications.requestPermissionsAsync();
            if (status !== 'granted') {
                console.warn('Notification permissions not granted');
            }
        } catch (error) {
            console.error('Failed to request notification permissions:', error);
        }
    };

    // Update notification with current progress
    const updateNotification = async () => {
        if (!showNotification || !currentFileName) return;

        await updateProgressNotification(
            currentIndex + 1,
            downloadsWithSizes.length,
            currentFileName,
            downloadedBytes + (currentFileProgress * (downloadsWithSizes[currentIndex]?.fileSize || 0)),
            totalBytes
        );
    };

    // Update notification when progress changes
    useEffect(() => {
        if (!isChecking && !isAllDownloaded && currentFileName) {
            updateNotification();
        }
    }, [overallProgress, currentFileName, downloadedBytes, currentFileProgress]);

    // Fetch file sizes for all downloads
    useEffect(() => {
        const fetchFileSizes = async () => {
            const updatedDownloads: DownloadWithSize[] = [];
            let total = 0;

            for (const download of downloads) {
                try {
                    const response = await fetch(download.downloadLink, { method: 'HEAD' });
                    const contentLength = response.headers.get('content-length');
                    const fileSize = contentLength ? parseInt(contentLength) : 0;

                    updatedDownloads.push({
                        ...download,
                        fileSize
                    });
                    total += fileSize;
                } catch (error) {
                    console.warn(`Could not fetch size for ${download.filename}:`, error);
                    updatedDownloads.push({
                        ...download,
                        fileSize: 0
                    });
                }
            }

            setDownloadsWithSizes(updatedDownloads);
            setTotalBytes(total);
        };

        fetchFileSizes();
    }, [downloads]);

    // Check if all files already exist
    useEffect(() => {
        if (downloadsWithSizes.length === 0) return;

        const checkAllFiles = async () => {
            setIsChecking(true);

            let allExist = true;
            let firstNonExistingIndex = 0;
            let alreadyDownloadedBytes = 0;

            for (let i = 0; i < downloadsWithSizes.length; i++) {
                const { saveFolderPath, filename, fileSize = 0 } = downloadsWithSizes[i];
                const completePath = saveFolderPath + filename;
                const exists = await checkIfFileExists(completePath);

                if (exists) {
                    alreadyDownloadedBytes += fileSize;
                } else if (allExist) {
                    allExist = false;
                    firstNonExistingIndex = i;
                }
            }

            setDownloadedBytes(alreadyDownloadedBytes);

            if (allExist) {
                await downloadFinishedCallback()
            } else {
                setCurrentIndex(firstNonExistingIndex);
                setCurrentFileName(downloadsWithSizes[firstNonExistingIndex].filename);
                updateOverallProgressByBytes(alreadyDownloadedBytes, 0);
            }

            setIsChecking(false);
        };

        checkAllFiles();
    }, [downloadsWithSizes, enableBackgroundDownload, showNotification]);

    async function downloadFinishedCallback() {
        setOverallProgress(1);
        setIsAllDownloaded(true);
        // Show completion notification
        if (showNotification) {
            await showCompletionNotification();
        }
        if (onAllFinished) onAllFinished();
    }

    useEffect(() => {
        handleDownloadsSequentially()
    }, [currentIndex, isChecking, isAllDownloaded]);

    async function handleDownloadsSequentially() {
        if (isChecking || isAllDownloaded || downloadsWithSizes.length === 0) return;

        const currentDownload = downloadsWithSizes[currentIndex];
        if (!currentDownload) return;

        const { downloadLink, saveFolderPath, filename, onFinished, fileSize = 0 } = currentDownload;
        const completePath = saveFolderPath + filename;

        setCurrentFileName(filename);

        const downloadFile = async () => {
            // First check if file already exists
            const exists = await checkIfFileExists(completePath);
            if (exists) {
                setCurrentFileProgress(1);
                setDownloadedBytes(prev => prev + fileSize);
                handleDownloadComplete();
                return;
            }

            const tempDirPath = FileSystem.cacheDirectory + "temp/";
            const tempFilePath = tempDirPath + filename;

            try {
                await deleteDir(tempDirPath);
                await ensureDirExists(tempDirPath);
                await ensureDirExists(saveFolderPath);

                if (enableBackgroundDownload) {
                    // For background downloads, use simple downloadAsync without progress
                    const downloadResult = await FileSystem.downloadAsync(downloadLink, tempFilePath);

                    if (downloadResult.status === 200) {
                        await FileSystem.moveAsync({
                            from: tempFilePath,
                            to: completePath
                        });

                        setDownloadedBytes(prev => prev + fileSize);

                        if (filename.endsWith(".zip")) {
                            await unzipFile(completePath);
                        }

                        if (onFinished) onFinished();
                        handleDownloadComplete();
                    }
                } else {
                    // Foreground download with progress
                    const downloadableResumable = FileSystem.createDownloadResumable(
                        downloadLink,
                        tempFilePath,
                        {},
                        (progressData) => {
                            const progress = progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite;

                            setCurrentFileProgress(progress);

                            const currentFileBytes = progressData.totalBytesWritten;
                            const overallProgress = updateOverallProgressByBytes(downloadedBytes, currentFileBytes);

                            if (overallProgress >= 1 && !isAllDownloaded) {
                                downloadFinishedCallback()
                            }
                        }
                    );

                    const downloadResult = await downloadableResumable.downloadAsync();

                    if (downloadResult) {
                        await FileSystem.moveAsync({
                            from: tempFilePath,
                            to: completePath
                        });

                        setDownloadedBytes(prev => prev + fileSize);

                        if (filename.endsWith(".zip")) {
                            await unzipFile(completePath);
                        }

                        if (onFinished) onFinished();
                        handleDownloadComplete();
                    }
                }
            } catch (error) {
                console.error("Download failed:", error);
                setError(error as Error);
                if (showNotification) {
                    await showErrorNotification();
                }
                if (onError) onError();
            }
        };

        downloadFile();
    }

    const handleDownloadComplete = async () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < downloadsWithSizes.length) {
            setCurrentIndex(nextIndex);
            setCurrentFileProgress(0);
        } else {
            setIsAllDownloaded(true);
            setOverallProgress(1);

            // Show completion notification
            if (showNotification) {
                await showCompletionNotification();
            }

            if (onAllFinished) onAllFinished();
        }
    };

    const unzipFile = async (completePath: string) => {
        try {
            console.log("ZIP path:", completePath);
            const pathUnzipped = getUnzippedDirPath(completePath);
            await ensureDirExists(pathUnzipped);
            const resultPath = await unzip(completePath, pathUnzipped);
            console.log('Files in ZIP:', resultPath);

            await storeImagesDict();
        } catch (error) {
            console.error('Error listing ZIP contents:', error);
        }
    };

    const updateOverallProgressByBytes = (completedBytes: number, currentFileBytes: number) => {
        let overallProgress = 0

        if (totalBytes === 0) {
            const completedPortions = currentIndex;
            const currentPortion = currentFileProgress;
            const totalItems = downloadsWithSizes.length;
            overallProgress = (completedPortions + currentPortion) / totalItems
        } else {
            const totalDownloadedBytes = completedBytes + currentFileBytes;
            overallProgress = Math.min(totalDownloadedBytes / totalBytes, 1)
        }
        setOverallProgress(overallProgress)
        return overallProgress
    };

    const retry = () => {
        setError(undefined);
        handleDownloadsSequentially();
    };

    // Cleanup notification on unmount
    useEffect(() => {
        return () => {
            if (showNotification) {
                Notifications.cancelScheduledNotificationAsync(DOWNLOAD_NOTIFICATION_ID);
            }
        };
    }, [showNotification]);

    return {
        overallProgress,
        isAllDownloaded,
        currentFileName,
        currentFileProgress,
        isLoading: isChecking,
        error,
        retry,
        totalBytes,
        downloadedBytes,
        isBackgroundTaskRegistered
    };
}