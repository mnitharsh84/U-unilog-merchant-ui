import { Badge, HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { NDR_DETAILS, ReportsColumns } from 'page-modules/ndr/types/reports'

import styles from './cell-styles.module.scss'

type Props = {
    info: CellContext<ReportsColumns, NDR_DETAILS>
}

export default function NdrDetails({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Dated: </Text> */}
                <Text className={styles.value}>{getValue().date}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Attempts: </Text> */}
                <Text className={styles.value}>Attempts: {getValue().attempts}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Reason: </Text> */}
                <Text className={styles.value} color="red.400" fontWeight="bold">
                    {getValue().reason}
                </Text>
            </HStack>
            <HStack justifyContent="space-between" mt={1}>
                {/* <Text className={styles.key}>Status: </Text> */}
                <Badge
                    colorScheme={getValue().severity === 'LOW' ? 'orange' : 'red'}
                    className={styles.value}
                    fontSize="10px"
                >
                    {getValue().pending}
                </Badge>
            </HStack>
            {/* <Text>{getValue().date}</Text>
            <Text>{getValue().attempts}</Text>
            <Text>{getValue().reason}</Text>
            <Text>{getValue().pending}</Text> */}
        </>
    )
}
