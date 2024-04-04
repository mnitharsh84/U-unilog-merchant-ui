import { AttachmentIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { CreateImportType } from 'apis/import/post'
import { ChangeEvent, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import Overlay from 'shared/components/Overlay/Overlay'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

import { useMutateCreateImport } from '../hooks/mutations'

type Props = {
    importType: string
    importOption: string
    handleImportUpload: (response: CreateImportType) => void
    additionalInformation?: Record<string, string>
}

export default function ImportUpload({ importType, importOption, handleImportUpload, additionalInformation }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [file, setFile] = useState<File | null>(null)

    const [loading, setLoading] = useState<boolean>(false)

    const mutationCreateImport = useMutateCreateImport()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return
        setFile(e.target.files[0])
    }

    const uploadFile = () => {
        if (!file) return

        const formData = new FormData()

        formData.append('name', importType)
        formData.append('importOption', importOption)
        formData.append('file', file)

        if (additionalInformation) {
            Object.keys(additionalInformation).forEach((key) => {
                // TODO: handle case when more than one keys are there
                formData.append(`additionalInformationKey`, key)
                formData.append(`additionalInformationValue`, additionalInformation[key])
            })
        }

        setLoading(true)
        mutationCreateImport.mutate(formData, {
            onSuccess: (data) => {
                handleImportUpload(data)
                if (data.success)
                    toast.loading(`Import for ${file.name} has begun. Please check its status in the toolbar`, {
                        duration: 3000,
                    })
                else toast.error('Could not process import, please try again')
            },
            onSettled: () => {
                setLoading(false)
                setFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ''
            },
        })
    }

    return (
        <>
            <Flex gap={2} alignItems={'center'}>
                <Flex
                    alignItems={'center'}
                    border={'1px dotted'}
                    width={'fit-content'}
                    borderRadius={'0.5rem'}
                    padding={'0.5rem'}
                    gap={1}
                >
                    <Box>
                        <Button
                            // colorScheme={'gray.200'}
                            fontSize={'sm'}
                            leftIcon={<AttachmentIcon />}
                            isDisabled={!importType}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Choose File
                        </Button>
                        <Input type="file" accept=".csv" w={`100%`} onChange={handleChange} hidden ref={fileInputRef} />
                    </Box>
                    {!!file?.name ? (
                        <TextWithTooltip
                            width="10rem"
                            maxWidth="10rem"
                            text={file.name}
                            textProps={{ textDecoration: 'underline', textColor: 'lightseagreen' }}
                        />
                    ) : (
                        <Text opacity={0.7}>No file chosen</Text>
                    )}
                </Flex>
                {!!file?.name ? (
                    <Button
                        colorScheme={'teal'}
                        fontSize={'sm'}
                        isDisabled={!importOption || !importType}
                        onClick={uploadFile}
                    >
                        Upload
                    </Button>
                ) : null}
            </Flex>
            {loading && <Overlay />}
        </>
    )
}
