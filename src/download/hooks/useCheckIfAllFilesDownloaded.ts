import { useEffect, useState } from "react";
import { checkIfAllFilesDownloaded } from "../utils/fileUtils";

type useCheckIfAllFilesDownloadedProps = {
    onTrue?: () => void,
    onFalse?: () => void
}

export default function useCheckIfAllFilesDownloaded({onTrue, onFalse}: useCheckIfAllFilesDownloadedProps) {

    const [allFilesDonwloaded, setAllFilesDownloaded] = useState<boolean | undefined>(undefined)

    useEffect(() => {
        checkIfAllFilesDownloaded()
            .then(res => {
                if(res && onTrue) 
                    onTrue()

                if(res && onFalse)
                    onFalse()
                
                setAllFilesDownloaded(res)
            })
    }, [])

    return allFilesDonwloaded
}