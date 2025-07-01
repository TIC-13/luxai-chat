import { getStoredImagesDict, ImagesDict, parseImagesToHTMLTags, storeImagesDict } from "@/src/download/utils/markdownImagesUtils"
import { marked } from "marked"
import { useEffect, useState } from "react"

export default function useParseMarkdownToHTML(ragContexts: string[]) {

    const [parsedContexts, setParsedContexts] = useState<string[] | undefined>(undefined)
    const imagesDict = useGetDictionayOfImagesFromManual()

    useEffect(() => {
        if (imagesDict !== undefined)
            pipeline(ragContexts)
    }, [ragContexts, imagesDict])

    async function pipeline(contexts: string[]) {

        if (imagesDict === undefined)
            throw Error("Dictionay of images not loaded")

        const parsedContextsInPipeline = markdownFullParse(contexts, imagesDict)
        setParsedContexts(parsedContextsInPipeline)
    }

    return parsedContexts
}

export function useGetDictionayOfImagesFromManual() {
    const [imagesDict, setImagesDict] = useState<ImagesDict | undefined>(undefined)

    useEffect(() => {
        pipeline()
    }, [])

    async function pipeline() {
        if (imagesDict === undefined) {

            const storedImagesDict = getStoredImagesDict()

            if (storedImagesDict.isEmpty()) {
                const imagesDict = await storeImagesDict()
                setImagesDict(imagesDict)
                return 
            }

            setImagesDict(storedImagesDict.getAll())

        }
    }

    return imagesDict

}

export function markdownFullParse(markdownList: string[], imagesDict: ImagesDict) {
    const firstParse = markdownList.map(markdown => parseMarkdownText(markdown))
    const finalParse: string[] = []

    for (let context of firstParse) {
        const parsed = parseImagesToHTMLTags(context, imagesDict)
        finalParse.push(marked.parse(parsed) as string)
    }

    return finalParse
}

export function parseMarkdownText(input: string): string {
    const formatted = input
        .replaceAll(".gif", "")
    let lines = formatted.split('\\n');
    let linesConcatenated = lines[0]

    lines.slice(1).map(line => {
        linesConcatenated += `\n${line.trim()}`
    })

    return linesConcatenated;
}