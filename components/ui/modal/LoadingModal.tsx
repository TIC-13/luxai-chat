import { ModalBackdrop, ModalContainer, ModalText, MyModal } from "@/components/Modal";
import { useThemeColor } from "@/hooks/useThemeColor";
import * as Progress from 'react-native-progress';

export type ProgressBarModalProps = {
    isVisible: boolean,
    content?: string,
}

export default function ProgressBarModal({ isVisible, content }: ProgressBarModalProps) {

    const progressBarFilledColor = useThemeColor("progressBarFilled")
    const progressBarUnfilledColor = useThemeColor("progressBarUnfilled")

    return (
        <MyModal
            visible={isVisible}
        >
            <ModalBackdrop>
                <ModalContainer style={{ width: "90%", paddingVertical: 15 }}>

                    {
                        content !== undefined &&
                        <ModalText>
                            {content}
                        </ModalText>
                    }
                    <Progress.Bar
                        style = {{marginTop: 30}}
                        indeterminate={true}
                        //progress={overallProgress}
                        height={10}
                        color={progressBarFilledColor}
                        unfilledColor={progressBarUnfilledColor}
                        borderWidth={0}
                    />
                </ModalContainer>
            </ModalBackdrop>
        </MyModal>
    )
}