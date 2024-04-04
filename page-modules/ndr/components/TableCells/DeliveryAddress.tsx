import { HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { DELIVERY_ADDRESS, ReportsColumns } from 'page-modules/ndr/types/reports'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

import styles from './cell-styles.module.scss'

type Props = {
    info: CellContext<ReportsColumns, DELIVERY_ADDRESS>
}

export default function DeliveryAddress({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Address: </Text> */}
                <TextWithTooltip text={getValue().address} width={'8rem'}></TextWithTooltip>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>City: </Text> */}
                <Text className={styles.value}>
                    {' '}
                    {getValue().city}, {getValue().state}, {getValue().pincode}
                </Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Country: </Text> */}
                <Text className={styles.value}>{getValue().country}</Text>
            </HStack>
        </>
    )
}
