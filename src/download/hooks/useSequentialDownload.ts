import { checkIfFileExists, deleteDir, ensureDirExists, getUnzippedDirPath } from '@/src/download/utils/fileUtils';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import { unzip } from "react-native-zip-archive";
import { storeImagesDict } from '../utils/markdownImagesUtils';
import { useDownloadProps } from './useDownload';

type useSequentialDownloadProps = {
    downloads: useDownloadProps[];
    onAllFinished?: () => void;
    onError?: () => void
};

export default function useSequentialDownload({ downloads, onAllFinished, onError }: useSequentialDownloadProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const [isAllDownloaded, setIsAllDownloaded] = useState(false);
    const [currentFileProgress, setCurrentFileProgress] = useState(0);
    const [currentFileName, setCurrentFileName] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    const [error, setError] = useState<Error | undefined>(undefined)

    // Check if all files already exist
    useEffect(() => {
        const checkAllFiles = async () => {
            setIsChecking(true);

            let allExist = true;
            let firstNonExistingIndex = 0;

            for (let i = 0; i < downloads.length; i++) {
                const { saveFolderPath, filename } = downloads[i];
                const completePath = saveFolderPath + filename;
                const exists = await checkIfFileExists(completePath);

                if (!exists) {
                    allExist = false;
                    firstNonExistingIndex = i;
                    break;
                }
            }

            if (allExist) {
                setOverallProgress(1);
                setIsAllDownloaded(true);
                if (onAllFinished) onAllFinished();
            } else {
                setCurrentIndex(firstNonExistingIndex);
                setCurrentFileName(downloads[firstNonExistingIndex].filename);
            }

            setIsChecking(false);
        };

        checkAllFiles();
    }, []);

    useEffect(() => {
        handleDownloadsSequnetially()
    }, [currentIndex, isChecking, isAllDownloaded]);

    async function handleDownloadsSequnetially() {
        if (isChecking || isAllDownloaded) return;

        const currentDownload = downloads[currentIndex];
        if (!currentDownload) return;

        const { downloadLink, saveFolderPath, filename, onFinished } = currentDownload;
        const completePath = saveFolderPath + filename;

        setCurrentFileName(filename);

        const downloadFile = async () => {
            // First check if file already exists
            const exists = await checkIfFileExists(completePath);
            if (exists) {
                setCurrentFileProgress(1);
                handleDownloadComplete();
                return;
            }

            const tempDirPath = FileSystem.cacheDirectory + "temp/";
            const tempFilePath = tempDirPath + filename;

            try {
                await deleteDir(tempDirPath);
                await ensureDirExists(tempDirPath);
                await ensureDirExists(saveFolderPath);

                const downloadableResumable = FileSystem.createDownloadResumable(
                    downloadLink,
                    tempFilePath,
                    {},
                    (progressData) => {
                        const progress = progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite;
                        setCurrentFileProgress(progress);
                        updateOverallProgress(progress);
                    }
                );

                const downloadResult = await downloadableResumable.downloadAsync();

                if (downloadResult) {
                    await FileSystem.moveAsync({
                        from: tempFilePath,
                        to: completePath
                    });

                    if (filename.endsWith(".zip")) {
                        await unzipFile(completePath)
                    }

                    if (onFinished) onFinished();
                    handleDownloadComplete();
                }
            } catch (error) {
                console.error("Download failed:", error);
                setError(error as Error)
                if (onError) onError()
                // Handle error as needed
            }
        };

        downloadFile();
    }

    // Helper function to move to the next download or finish
    const handleDownloadComplete = () => {
        if (currentIndex + 1 < downloads.length) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            setCurrentFileProgress(0);
        } else {
            setIsAllDownloaded(true);
            setOverallProgress(1);
            if (onAllFinished) onAllFinished();
        }
    };

    const unzipFile = async (completePath: string) => {
        try {
            console.log("ZIP path:", completePath)
            const pathUnzipped = getUnzippedDirPath(completePath)
            await ensureDirExists(pathUnzipped)
            const resultPath = await unzip(completePath, pathUnzipped)
            console.log('Files in ZIP:', resultPath);

            await storeImagesDict()

        } catch (error) {
            console.error('Error listing ZIP contents:', error);
        }
    }

    // Helper function to calculate overall progress
    const updateOverallProgress = (currentProgress: number) => {
        const completedPortions = currentIndex;
        const currentPortion = currentProgress;
        const totalItems = downloads.length;

        setOverallProgress((completedPortions + currentPortion) / totalItems);
    };

    const retry = () => {
        setError(undefined)
        handleDownloadsSequnetially()
    }

    return {
        overallProgress,
        isAllDownloaded,
        currentFileName,
        currentFileProgress,
        isLoading: isChecking,
        error,
        retry
    };
}

