import { Box, Select, Text } from '@chakra-ui/react'
import { AiFillCaretDown } from 'react-icons/ai'

import { IMPORT_OPTION } from '../utils'

type Props = {
    importType: string
    importOption: string
    handleImportOptionSelection: (importOption: string) => void
}

export default function SelectImportOption({ importType, importOption, handleImportOptionSelection }: Props) {
    if (!importType) return <></>

    return (
        <Box mb={3}>
            <Text fontSize="10px" color="gray.500" mb={1} ps={3}>
                Import option
            </Text>
            <Select
                w={'300px'}
                h={'32px'}
                size={'md'}
                fontSize={'medium'}
                background={'gray.200'}
                borderRadius={'0.5rem'}
                placeholder="Select report"
                icon={<AiFillCaretDown fontSize={'14px'} />}
                onChange={(ev) => handleImportOptionSelection(ev.target.value)}
                value={importOption}
            >
                {Object.keys(IMPORT_OPTION).map((key) => (
                    <option
                        key={IMPORT_OPTION[key as keyof typeof IMPORT_OPTION]}
                        value={IMPORT_OPTION[key as keyof typeof IMPORT_OPTION]}
                    >
                        {key}
                    </option>
                ))}
            </Select>
        </Box>
    )
}
