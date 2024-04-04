import { Box, Select, Text } from '@chakra-ui/react'
import { AiFillCaretDown } from 'react-icons/ai'

import { useImportTypes } from '../hooks/queries'

type Props = {
    importType: string
    handleImportTypeSelection: (importType: string) => void
}

export default function SelectImport({ importType, handleImportTypeSelection }: Props) {
    const { data } = useImportTypes()

    return (
        <Box mb={3}>
            <Text fontSize="10px" color="gray.500" mb={1} ps={3}>
                Import type
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
                onChange={(ev) => handleImportTypeSelection(ev.target.value)}
                value={importType}
            >
                {data?.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </Select>
        </Box>
    )
}
