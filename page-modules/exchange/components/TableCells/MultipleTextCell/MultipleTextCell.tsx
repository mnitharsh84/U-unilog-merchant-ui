import { Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ExchangeColumns } from 'page-modules/exchange/type/exchange'
import React from 'react'

import styles from './MultipleTextCell.module.scss'

type ColumnsData = { [key: string]: any }
type Props = {
    info: CellContext<ExchangeColumns, ColumnsData>
}
const MultipleTextCell = ({ info: { getValue } }: Props) => {
    const data = getValue()
    return (
        <Flex gap={2} flexDir="column">
            {data.map((obj: any) =>
                Object.keys(obj).map((key) => (
                    <Text key={key} className={styles.overflowEllipsis} fontWeight="bold">
                        {key}
                        <Text fontWeight="normal" as="span">
                            {' '}
                            : {obj[key]}
                        </Text>
                    </Text>
                )),
            )}
        </Flex>
    )
}

export default MultipleTextCell
