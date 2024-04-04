import { Flex, Icon, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ColumnsData } from 'page-modules/settings/types/Shared/type'
import React from 'react'
import { IconType } from 'react-icons'

type Props = {
    info: CellContext<ColumnsData, string>
    iconMap?: { [key: string]: IconType }
}
const Name = ({ info: { getValue }, iconMap }: Props) => {
    return (
        <Flex align="center" gap={2} pl={2}>
            {iconMap && <Icon as={iconMap[getValue().toUpperCase()]} boxSize={5} color="teal.500" />}
            <Text>{getValue()}</Text>
        </Flex>
    )
}

export default Name
