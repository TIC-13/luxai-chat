import { IMAGES_FULL_PATH } from '@/constants/Files';
import { PersistentDictionary } from '@/src/utils/mmkv/dictionary';
import * as FileSystem from 'expo-file-system';
import { Image } from 'react-native';
import { getUnzippedDirPath } from './fileUtils';

export const getStoredImagesDict = () => new PersistentDictionary<ImagesValue>("images")

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

interface ImageDimensions {
    width: number;
    height: number;
}

export type ImagesValue = {base64: string, dimensions: ImageDimensions}

export type ImagesDict = { [key: string]: ImagesValue }

export const generateImagesDict = async (): Promise<ImagesDict> => {
    const imagesFolderUri = getUnzippedDirPath(IMAGES_FULL_PATH)
    const imagesArray = await FileSystem.readDirectoryAsync(imagesFolderUri)

    const imagesObject: ImagesDict = {}

    await Promise.all(
        imagesArray.map(async (imageFileName: string) => {
            const imageUri = imagesFolderUri + "/" + imageFileName

            const [dimensions, base64]: [ImageDimensions, string] = await Promise.all([
                new Promise<ImageDimensions>((resolve) => {
                    Image.getSize(
                        imageUri,
                        (width: number, height: number) => resolve({ width, height }),
                        (error: any) => {
                            console.warn(`Failed to get dimensions for ${imageFileName}:`, error);
                            resolve({ width: 0, height: 0 });
                        }
                    );
                }),
                uriToBase64(imageUri)
            ]);

            imagesObject[`image:${removeFileExtension(imageFileName)}`] = {
                base64,
                dimensions
            }
        })
    );

    return imagesObject
}

export async function storeImagesDict() {

    const storedImagesDict = getStoredImagesDict()

    if (storedImagesDict.isEmpty()) {
        const imagesDict = await generateImagesDict()
        storedImagesDict.store(imagesDict)
        return imagesDict
    }

    return undefined
}

export const parseMarkdownImages = (markdownText: string, imagesObject: ImagesDict) => {
    const imagesTags = [...new Set(markdownText.match(/image:[^\s,.*'"`)]+/gi) || [])].map(tag => tag.toLowerCase());
    let newMarkdown = markdownText

    console.log("Image tags", imagesTags)

    for (let tag of imagesTags) {
        const base64Image = imagesObject[tag]?.base64
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
