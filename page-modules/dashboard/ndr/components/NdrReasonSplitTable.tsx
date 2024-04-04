import { Center, Flex } from '@chakra-ui/react'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrReason } from '../hooks/queries'

export default function NdrReasonSplitTable() {
    const { startDate, endDate } = useToolbarContext()

    const { data, isLoading, isError } = useNdrReason(startDate, endDate)

    if (isLoading)
        return (
            <Center h={`300px`}>
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
        reason: 'Reason',
        deliveredShipments: 'Delivered',
        lostOrDamagedShipments: 'Lost / Damaged / Unknown',
        pendingShipments: 'Pending',
        rtoShipments: 'RTO',
        totalNdrRaised: 'Total NDRs raised',
    }

    const tableData: { [key in keyof typeof tableColumns]: { value: string; align: 'left' | 'right' } }[] =
        data.reason_wise_count_details.map((reason) => ({
            reason: { value: reason['reason'], align: 'left' },
            deliveredShipments: { value: String(reason['Delivered shipments']), align: 'right' },
            lostOrDamagedShipments: { value: String(reason['Lost/Damaged/Unknown shipments']), align: 'right' },
            pendingShipments: { value: String(reason['Pending shipments']), align: 'right' },
            rtoShipments: { value: String(reason['RTO shipments']), align: 'right' },
            totalNdrRaised: {
                value: String(reason['Total NDRs Raised (1 shipment may have multiple reports)']),
                align: 'right',
            },
        })) || []

    return (
        <Flex h={`300px`} justify="center" overflow={'auto'}>
            <ChakraTable<typeof tableColumns> columns={tableColumns} data={tableData} />
        </Flex>
    )
}
