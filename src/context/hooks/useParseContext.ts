import { ImagesDict, generateImagesDict, parseMarkdownImages } from "@/src/download/utils/markdownImagesUtils"
import { useEffect, useState } from "react"

export default function useParseContext(ragContexts: string[]) {

    const [parsedContexts, setParsedContexts] = useState<string[] | undefined>(undefined)
    const [imagesDict, setImagesDict] = useState<ImagesDict | undefined>(undefined)

    useEffect(() => {
        pipeline()
    }, [ragContexts])

    async function pipeline() {
        let imagesDictInPipeline = imagesDict

        if (imagesDictInPipeline === undefined) {
            imagesDictInPipeline = await generateImagesDict()
            setImagesDict(imagesDictInPipeline)
        }

        const parsedContextsInPipeline = await fullParse(imagesDictInPipeline)
        setParsedContexts(parsedContextsInPipeline)
    }


    async function fullParse(imagesDict: ImagesDict) {
        const firstParse = ragContexts.map(context => parseContext(context))
        const finalParse: string[] = []

        for (let context of firstParse) {
            const parsed = await parseMarkdownImages(context, imagesDict)
            finalParse.push(parsed)
        }

        return finalParse
    }

    function parseContext(input: string): string {
        const formatted = input
            .slice(3)
        let lines = formatted.split('\\n');
        let linesConcatenated = lines[0]

        lines.slice(1).map(line => {
            linesConcatenated += `\n${line.trim()}`
        })

        console.log("ORIGINAL", input)
        console.log('PARSED', linesConcatenated)

        return linesConcatenated;
    }


    return parsedContexts
}