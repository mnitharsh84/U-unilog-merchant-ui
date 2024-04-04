import { HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { CUSTOMER_DETAILS, ReportsColumns } from 'page-modules/ndr/types/reports'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

import styles from './cell-styles.module.scss'

type Props = {
    info: CellContext<ReportsColumns, CUSTOMER_DETAILS>
}

export default function CustomerDetails({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Name: </Text> */}
                <Text className={styles.value}>{getValue().name}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Phone: </Text> */}
                <Text className={styles.value}>{getValue().phone}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Email: </Text> */}
                <Text className={styles.value}>{getValue().email || '-'}</Text>
            </HStack>
            <HStack justifyContent="space-between" alignItems="flex-start">
                {/* <Text className={styles.key}>Address: </Text> */}
                <TextWithTooltip
                    text={`${getValue().city}, ${getValue().state}, ${getValue().pincode}`}
                    width={`8rem`}
                />
            </HStack>
        </>
    )
}
