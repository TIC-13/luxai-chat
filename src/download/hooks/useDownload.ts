import { checkIfFileExists, deleteDir, ensureDirExists } from '@/src/download/utils/fileUtils';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';


export type useDownloadProps = {
    downloadLink: string,
    saveFolderPath: string,
    filename: string,
    onFinished?: (() => void) | undefined 
}

export default function useDownload(
    { downloadLink, saveFolderPath, filename, onFinished }: useDownloadProps
) {

    const completePath = saveFolderPath + filename

    const [progress, setProgress] = useState(0)
    const [isDownloaded, setIsDownloaded] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        checkIfFileExists(completePath)
            .then(downloaded => { 
                setIsDownloaded(downloaded)
                if(downloaded) {
                    setProgress(1)
                }
            })
    }, [])

    async function startDownload() {
        const tempDirPath = FileSystem.cacheDirectory + "temp/"
        const tempFilePath = tempDirPath + filename

        await deleteDir(tempDirPath)
        await ensureDirExists(tempDirPath)
        await ensureDirExists(saveFolderPath)
        const downloadableResumable = FileSystem.createDownloadResumable(
            downloadLink,
            tempFilePath,
            {},
            (progressData) => {
                setProgress(progressData.totalBytesWritten/progressData.totalBytesExpectedToWrite)
            } 
        )
        const downloadResult = await downloadableResumable.downloadAsync()

        if (downloadResult !== undefined) {
            await FileSystem.moveAsync({
                from: tempFilePath,
                to: completePath
            })
            setIsDownloaded(true)
            if(onFinished) onFinished()
        }

        return downloadResult
    }


    return { startDownload, progress, isDownloaded }

}
