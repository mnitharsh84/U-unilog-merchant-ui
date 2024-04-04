import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'
import { useRef } from 'react'
import { ReactNode } from 'react'

interface ConfirmationDialogProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: ReactNode
    body: ReactNode
    cancelText?: string
    confirmText?: string
    isValid?: boolean
}
const CustomAlertDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    body,
    cancelText = 'Cancel',
    confirmText = 'Confirm',
    isValid = true,
}: ConfirmationDialogProps) => {
    const cancelRef = useRef<HTMLInputElement>(null)

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>{body}</AlertDialogBody>

                    <AlertDialogFooter>
                        <Button bg={`white`} variant={'outline'} size={'xs'} h={`28px`} onClick={onClose}>
                            {cancelText}
                        </Button>
                        <Button
                            isDisabled={!isValid}
                            colorScheme={'teal'}
                            size={'xs'}
                            h={`28px`}
                            onClick={onConfirm}
                            ml={3}
                        >
                            {confirmText}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}

export default CustomAlertDialog
