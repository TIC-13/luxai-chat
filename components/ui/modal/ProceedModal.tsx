import { ModalBackdrop, ModalButton, ModalContainer, ModalFooter, ModalHeader, ModalText, ModalTitle, MyModal } from "@/components/Modal"

export type ProceedModalProps = {
    close: () => void,
    isVisible: boolean,
    title: string,
    content: string,
    onConfirm: () => void,
    buttonLabel?: string
}

export default function ProceedModal({ close, isVisible, title, content, onConfirm, buttonLabel = "Continue" }: ProceedModalProps) {
    return (
        <MyModal
            onRequestClose={close}
            visible={isVisible}
        >
            <ModalBackdrop onPress={close}>
                <ModalContainer>
                    <ModalHeader>
                        <ModalTitle>{title}</ModalTitle>
                    </ModalHeader>
                    <ModalText>
                        {content}
                    </ModalText>
                    <ModalFooter>
                        <ModalButton
                            variant="primary"
                            title={buttonLabel}
                            onPress={() => {
                                onConfirm()
                                close()
                            }}
                        />
                    </ModalFooter>
                </ModalContainer>
            </ModalBackdrop>
        </MyModal>
    )
}