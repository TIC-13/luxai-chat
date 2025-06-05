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

type DownloadWithSize = useDownloadProps & {
    fileSize?: number;
};

export default function useSequentialDownload({ downloads, onAllFinished, onError }: useSequentialDownloadProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [overallProgress, setOverallProgress] = useState(0);
    const [isAllDownloaded, setIsAllDownloaded] = useState(false);
    const [currentFileProgress, setCurrentFileProgress] = useState(0);
    const [currentFileName, setCurrentFileName] = useState<string | null>(null);
    const [isChecking, setIsChecking] = useState(true);
    const [downloadsWithSizes, setDownloadsWithSizes] = useState<DownloadWithSize[]>([]);
    const [totalBytes, setTotalBytes] = useState(0);
    const [downloadedBytes, setDownloadedBytes] = useState(0);

    const [error, setError] = useState<Error | undefined>(undefined)

    // Fetch file sizes for all downloads
    useEffect(() => {
        const fetchFileSizes = async () => {
            const updatedDownloads: DownloadWithSize[] = [];
            let total = 0;

            for (const download of downloads) {
                try {
                    // Make a HEAD request to get file size without downloading
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
                    // Fallback to equal weighting if size cannot be determined
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
                setOverallProgress(1);
                setIsAllDownloaded(true);
                if (onAllFinished) onAllFinished();
            } else {
                setCurrentIndex(firstNonExistingIndex);
                setCurrentFileName(downloadsWithSizes[firstNonExistingIndex].filename);
                updateOverallProgressByBytes(alreadyDownloadedBytes, 0);
            }

            setIsChecking(false);
        };

        checkAllFiles();
    }, [downloadsWithSizes]);

    useEffect(() => {
        handleDownloadsSequnetially()
    }, [currentIndex, isChecking, isAllDownloaded]);

    async function handleDownloadsSequnetially() {
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

                const downloadableResumable = FileSystem.createDownloadResumable(
                    downloadLink,
                    tempFilePath,
                    {},
                    (progressData) => {
                        const progress = progressData.totalBytesWritten / progressData.totalBytesExpectedToWrite;
                        setCurrentFileProgress(progress);
                        
                        // Update overall progress based on bytes
                        const currentFileBytes = progressData.totalBytesWritten;
                        updateOverallProgressByBytes(downloadedBytes, currentFileBytes);
                    }
                );

                const downloadResult = await downloadableResumable.downloadAsync();

                if (downloadResult) {
                    await FileSystem.moveAsync({
                        from: tempFilePath,
                        to: completePath
                    });

                    // Update downloaded bytes for completed file
                    setDownloadedBytes(prev => prev + fileSize);

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
        if (currentIndex + 1 < downloadsWithSizes.length) {
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

    // Helper function to calculate overall progress based on bytes
    const updateOverallProgressByBytes = (completedBytes: number, currentFileBytes: number) => {
        if (totalBytes === 0) {
            // Fallback to equal weighting if total size is unknown
            const completedPortions = currentIndex;
            const currentPortion = currentFileProgress;
            const totalItems = downloadsWithSizes.length;
            setOverallProgress((completedPortions + currentPortion) / totalItems);
        } else {
            const totalDownloadedBytes = completedBytes + currentFileBytes;
            setOverallProgress(Math.min(totalDownloadedBytes / totalBytes, 1));
        }
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
        retry,
        // Additional info that might be useful
        totalBytes,
        downloadedBytes
    };
}