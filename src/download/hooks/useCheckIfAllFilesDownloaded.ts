import { useEffect, useState } from "react";
import { checkIfAllFilesDownloaded } from "../utils/fileUtils";

type useCheckIfAllFilesDownloadedProps = {
    onTrue?: () => void
}

export default function useCheckIfAllFilesDownloaded({onTrue}: useCheckIfAllFilesDownloadedProps) {

    const [allFilesDonwloaded, setAllFilesDownloaded] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        checkIfAllFilesDownloaded()
            .then(res => {
                if(res && onTrue) onTrue()
                setAllFilesDownloaded(res)
            })
    }, [])

    return allFilesDonwloaded
}