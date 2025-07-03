import { ModalBackdrop, ModalButton, ModalButtonContainer, ModalButtonProps, ModalContainer, ModalFooter, ModalHeader, ModalText, ModalTitle, MyModal } from "@/components/Modal"
import { ReactNode } from "react"

type ChoiceModalProps = {
    close: () => void,
    isVisible: boolean,
    title: string,
    content: string,
    buttonsProps?: ModalButtonProps[],
    children?: ReactNode
}

export default function ChoiceModal({ close, isVisible, title, content, children, buttonsProps = [] }: ChoiceModalProps) {
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
                        <ModalButtonContainer>
                            <ModalButton
                                variant="secondary"
                                title="Cancel"
                                onPress={close}
                            />
                            {
                                buttonsProps.map((props, idx) => 
                                    <ModalButton 
                                        {...props}
                                        key={idx} 
                                        onPress = {(e) => {
                                            if(props.onPress !== undefined && props.onPress !== null) 
                                                props.onPress(e)
                                            close()
                                        }}
                                    />
                                )
                            }
                            {children}
                        </ModalButtonContainer>
                    </ModalFooter>
                </ModalContainer>
            </ModalBackdrop>
        </MyModal>
    )
}