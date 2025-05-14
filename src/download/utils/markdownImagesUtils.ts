import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

type ImageExtension = 'png' | 'jpg' | 'jpeg' | 'gif' | 'webp';

async function getImageBase64FromAsset(assetModule: number): Promise<string> {
    try {
        const asset = Asset.fromModule(assetModule);

        await asset.downloadAsync();

        if (!asset.localUri) {
            throw new Error('Asset local URI is undefined');
        }

        const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const mimeType = getMimeType(asset.localUri);

        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error('Error converting asset to base64:', error);
        throw error;
    }
}

function getMimeType(uri: string): string {
    const extension = uri.split('.').pop()?.toLowerCase() as ImageExtension | undefined;

    switch (extension) {
        case 'png':
            return 'image/png';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'gif':
            return 'image/gif';
        case 'webp':
            return 'image/webp';
        default:
            return 'image/png';
    }
}

export const parseMarkdownImages = async (markdownText: string) => {

    let newMarkdownText = markdownText

    for (let { name, file } of IMAGES) {
        const base64 = await getImageBase64FromAsset(file)
        newMarkdownText = newMarkdownText.replace(name, `![${name}](${base64})`)
    }

    console.log("new markdown", newMarkdownText)

    return newMarkdownText

};

const IMAGES = [
    {
        name: "image:fast_flashlight_default.gif",
        file: require("@/assets/images/manual/fast_flashlight_default.gif")
    },
    {
        name: "image:qs_12_flashlight",
        file: require("@/assets/images/manual/qs_12_flashlight.png")
    },
    {
        name: "image:qs_12_batterysaver",
        file: require("@/assets/images/manual/qs_12_batterysaver.png")
    }
]