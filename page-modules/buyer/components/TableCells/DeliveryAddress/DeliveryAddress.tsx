import { HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { BuyerColumns, DELIVERY_ADDRESS } from 'page-modules/buyer/types/buyer'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

type Props = {
    info: CellContext<BuyerColumns, DELIVERY_ADDRESS>
}

export default function DeliveryAddress({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                <TextWithTooltip text={getValue().address} width={'16rem'}></TextWithTooltip>
            </HStack>
            <HStack justifyContent="space-between">
                <Text>
                    {' '}
                    {getValue().city}, {getValue().state}, {getValue().pincode}
                </Text>
            </HStack>
        </>
    )
}
