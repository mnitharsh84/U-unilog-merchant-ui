import { Center, Flex } from '@chakra-ui/react'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import React from 'react'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrSuccessByCourier } from '../hooks/queries'

export default function NdrSuccessByCourierGraph() {
    const { startDate, endDate } = useToolbarContext()
    const { data, isLoading, isError } = useNdrSuccessByCourier(startDate, endDate)

    if (isLoading)
        return (
            <Center h={'300px'}>
                <Loading />
            </Center>
        )
    if (isError)
        return (
            <Center h={'300px'}>
                <ErrorPlaceholder />
            </Center>
        )

    const tableColumns = {
        courier: '',
        deliveredPercentage: 'Delivery Percentage',
        raisedAndDelivered: 'Raised and Delivered',
        raised: 'Raised',
    }

    let tableData: { [key in keyof typeof tableColumns]: { value: string; align: 'left' | 'right' } }[] = [
        {
            courier: { value: 'Overall', align: 'left' },
            deliveredPercentage: { value: `${String(data.overall.delivered_percentage)} %`, align: 'right' },
            raisedAndDelivered: {
                value: String(
                    data.overall.counts.find((count) => count.title === 'Total NDR Raised & Delivered shipments')
                        ?.value,
                ),
                align: 'right',
            },
            raised: {
                value: String(data.overall.counts.find((count) => count.title === 'Total NDR Raised shipments')?.value),
                align: 'right',
            },
        },
    ]

    tableData = tableData.concat(
        data.courier_wise_ndr_success.map((courier) => ({
            courier: { value: courier.courier, align: 'left' },
            deliveredPercentage: { value: `${String(courier.delivered_percentage)} %`, align: 'right' },
            raisedAndDelivered: {
                value: String(courier.counts.find((count) => count.title === 'Raised & Delivered')?.value),
                align: 'right',
            },
            raised: { value: String(courier.counts.find((count) => count.title === 'Raised')?.value), align: 'right' },
        })),
    )

    return (
        <Flex h={'300px'}>
            <ChakraTable<typeof tableColumns> columns={tableColumns} data={tableData} />
        </Flex>
    )
}
