import { Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import React from 'react'
import { ColumnsData } from 'shared/types/table'

type Props = {
    info: CellContext<ColumnsData, string>
}
const TextValue = ({ info: { getValue } }: Props) => {
    return (
        <Flex align="center" gap={2} pl={2}>
            <Text>{getValue()}</Text>
        </Flex>
    )
}

export default TextValue
