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

    }
}

export async function checkIfFileExists(filePath: string) {
    const fileInfo = await FileSystem.getInfoAsync(filePath)
    return fileInfo.exists
}

export async function deleteDir(dir: string) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (dirInfo.exists) {
        console.log(`Directory ${dir} exists, deleting…`);
        await FileSystem.deleteAsync(dir, { idempotent: true });
    }
}