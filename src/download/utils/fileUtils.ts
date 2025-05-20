import { DOWNLOADS } from '@/constants/Files';
import * as FileSystem from 'expo-file-system';

export async function ensureDirExists(dir: string) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
        console.log(`Directory ${dir} doesn't exist, creating…`);
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });

        const newInfo = await FileSystem.getInfoAsync(dir);
        if (newInfo.exists) {
            console.log(`Directory ${dir} created successfully.`);
        } else {
            console.error(`Failed to create directory ${dir}.`);
            throw new Error(`Failed to create directory ${dir}.`);
        }
    }else{
        console.log(`Directory ${dir} already existed`)
    }
}

export async function checkIfFileExists(filePath: string) {
    const fileInfo = await FileSystem.getInfoAsync(filePath)
    return fileInfo.exists
}

export async function checkIfAllFilesDownloaded() {
    for(let {saveFolderPath, filename} of DOWNLOADS){
        const exists = await checkIfFileExists(saveFolderPath + filename)
        if(!exists) return false
    }
    return true
}

export async function deleteDir(dir: string) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (dirInfo.exists) {
        console.log(`Directory ${dir} exists, deleting…`);
        await FileSystem.deleteAsync(dir, { idempotent: true });
    }
}

export function getUnzippedDirPath(zippedPath: string) {
    return zippedPath.split(".").slice(0, -1).join(".")
}