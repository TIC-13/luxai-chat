import { IMAGES_FULL_PATH } from '@/constants/Files';
import * as FileSystem from 'expo-file-system';
import { getUnzippedDirPath } from './fileUtils';

export const uriToBase64 = async (uri: string) => {
    try {
        if (!uri || typeof uri !== 'string') {
            throw new Error('Invalid URI provided');
        }

        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        let mimeType = 'image/jpeg';
        if (uri.endsWith('.png')) {
            mimeType = 'image/png';
        } else if (uri.endsWith('.gif')) {
            mimeType = 'image/gif';
        } else if (uri.endsWith('.webp')) {
            mimeType = 'image/webp';
        }
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error converting URI to base64:', error);
        throw error;
    }
};

export type ImagesDict = { [key: string]: string }

export const generateImagesDict = async () => {
    const imagesFolderUri = getUnzippedDirPath(IMAGES_FULL_PATH)
    const imagesArray = await FileSystem.readDirectoryAsync(imagesFolderUri)

    const imagesObject: ImagesDict = {}

    for (let imageFileName of imagesArray) {
        imagesObject[`image:${removeFileExtension(imageFileName)}`] = await uriToBase64(imagesFolderUri + "/" + imageFileName)
    }

    return imagesObject
}

export const parseMarkdownImages = (markdownText: string, imagesObject: ImagesDict) => {
    const imagesTags = [...new Set(markdownText.match(/image:[^\s,.)]+/gi) || [])].map(tag => tag.toLowerCase());
    let newMarkdown = markdownText

    console.log("Image tags", imagesTags)

    for (let tag of imagesTags) {
        const base64Image = imagesObject[tag]
        //console.log("Replacing", tag, "with", base64Image.slice(0,20))
        newMarkdown = newMarkdown.replaceAll(tag,
            base64Image !== undefined ?
                `![${tag}](${base64Image})` :
                tag
        )
    }

    return newMarkdown.replace(".gif", "")
};

const removeFileExtension = (filename: string) =>
    filename.split(".").slice(0, -1).join(".")
