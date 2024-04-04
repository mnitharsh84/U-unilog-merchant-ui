import { Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { BuyerColumns } from 'page-modules/buyer/types/buyer'
import React from 'react'

type Props = {
    info: CellContext<BuyerColumns, string>
}
const TextValue = ({ info: { getValue } }: Props) => {
    const val = getValue() ? getValue() : '-'
    return (
        <Flex align="center" gap={2} pl={2}>
            <Text>{val}</Text>
        </Flex>
    )
}

export default TextValue
