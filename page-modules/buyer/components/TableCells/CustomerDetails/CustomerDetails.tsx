import { HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { BuyerColumns, CUSTOMER_DETAILS } from 'page-modules/buyer/types/buyer'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

type Props = {
    info: CellContext<BuyerColumns, CUSTOMER_DETAILS>
}

export default function CustomerDetails({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Phone: </Text> */}
                <Text>{getValue().phone}</Text>
            </HStack>
            {getValue().email && (
                <HStack justifyContent="space-between">
                    <Text>{getValue().email || '-'}</Text>
                </HStack>
            )}
            <HStack justifyContent="space-between" alignItems="flex-start">
                <TextWithTooltip
                    text={`${getValue().city}, ${getValue().state}, ${getValue().pincode}`}
                    width={`8rem`}
                />
            </HStack>
        </>
    )
}
