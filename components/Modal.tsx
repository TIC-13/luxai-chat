import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Modal, ModalProps, Pressable, StyleSheet, Text, TextProps, View, ViewProps } from "react-native";
import { PressableProps } from "react-native-gesture-handler";

interface ModalBackdropProps extends ViewProps {
    children: React.ReactNode;
}

interface ModalButtonProps extends PressableProps {
    variant?: 'primary' | 'secondary' | 'danger';
    title: string;
}

interface ModalHeaderProps extends ViewProps {
    children: React.ReactNode;
}

interface ModalFooterProps extends ViewProps {
    children: React.ReactNode;
}

export function MyModal(props: ModalProps) {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            {...props}
        />
    )
}

export function ModalBackdrop(props: ModalBackdropProps) {
    return (
        <View
            {...props}
            style={[styles.modalBackdrop, props.style]}
        >
            {props.children}
        </View>
    )
}

export function ModalContainer(props: ViewProps) {
    const modalBackground = useThemeColor('modalBackground');
    const modalBorder = useThemeColor('modalBorder');
    
    return (
        <View
            {...props}
            style={[
                styles.modalView, 
                { 
                    backgroundColor: modalBackground,
                    borderColor: modalBorder 
                }, 
                props.style
            ]}
        />
    )
}

export function ModalHeader(props: ModalHeaderProps) {
    
    return (
        <View
            {...props}
            style={[
                styles.modalHeader,
                props.style
            ]}
        >
            {props.children}
        </View>
    )
}

export function ModalFooter(props: ModalFooterProps) {

    return (
        <View
            {...props}
            style={[
                styles.modalFooter,
                props.style
            ]}
        >
            {props.children}
        </View>
    )
}

export function ModalTitle(props: TextProps) {
    const modalTitle = useThemeColor('modalTitle');
    
    return (
        <Text 
            {...props}
            style={[
                styles.modalTitle,
                { color: modalTitle },
                props.style
            ]}
        />
    )
}

export function ModalText(props: TextProps) {
    const modalText = useThemeColor('modalText');
    
    return (
        <Text 
            {...props}
            style={[
                styles.modalText,
                { color: modalText },
                props.style
            ]}
        />
    )
}

export function ModalButtonContainer(props: ViewProps) {
    return (
        <View
            {...props}
            style={[styles.buttonContainer, props.style]}
        />
    )
}

export function ModalButton(props: ModalButtonProps) {
    const { variant = 'primary', title, ...pressableProps } = props;
    
    const modalButtonPrimary = useThemeColor('modalButtonPrimary');
    const modalButtonPrimaryText = useThemeColor('modalButtonPrimaryText');
    const modalButtonSecondary = useThemeColor('modalButtonSecondary');
    const modalButtonSecondaryText = useThemeColor('modalButtonSecondaryText');
    const modalButtonDanger = useThemeColor('modalButtonDanger');
    const modalButtonDangerText = useThemeColor('modalButtonDangerText');

    const modalBackground = useThemeColor('modalBackground');

    const getButtonStyles = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: modalButtonPrimary,
                    color: modalButtonPrimaryText
                };
            case 'secondary':
                return {
                    backgroundColor: modalButtonSecondary,
                    color: modalButtonSecondaryText
                };
            case 'danger':
                return {
                    backgroundColor: modalButtonDanger,
                    color: modalButtonDangerText
                };
            default:
                return {
                    backgroundColor: modalButtonPrimary,
                    color: modalButtonPrimaryText
                };
        }
    };
    
    const buttonStyles = getButtonStyles();
    
    return (
        <Pressable
            android_ripple={{ color: modalBackground }}
            {...pressableProps}
            style={[
                styles.button,
                { backgroundColor: buttonStyles.backgroundColor },
                pressableProps.style
            ]}
        >
            <Text style={[styles.buttonText, { color: buttonStyles.color }]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        //marginBottom: 15,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
    },
    modalView: {
        margin: 20,
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth: 1,
    },
    modalHeader: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginTop: -35,
        marginHorizontal: -35,
        //marginBottom: 20,
    },
    modalFooter: {
        width: '100%',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: -35,
        marginHorizontal: -35,
        //marginTop: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        gap: 10,
    },
    button: {
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
        elevation: 2,
        minWidth: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.98 }],
    },
    buttonText: {
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 16,
    }
});