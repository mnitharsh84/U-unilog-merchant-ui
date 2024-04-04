import { Center, Flex } from '@chakra-ui/react'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useOverviewCourierWiseReport } from '../hooks/queries'

export default function CourierWiseReportTable() {
    const { data, isLoading, isError } = useOverviewCourierWiseReport()

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
        courier: 'Courier Name',
        inTransit: 'In Transit',
        delivered: 'Delivered',
        ndrRaised: 'NDR Raised',
        ndrDelivered: 'NDR Delivered',
        ndrPending: 'NDR Pending',
        rto: 'RTO',
        outForDelivery: 'Out For Delivery',
        totalShipments: 'Total Shipments',
    }

    const tableData: { [key in keyof typeof tableColumns]: { value: string; align: 'left' | 'right' } }[] =
        data.map((report) => ({
            courier: { value: String(report.Courier), align: 'left' },
            inTransit: { value: String(report['In Transit']), align: 'right' },
            delivered: { value: String(report['Delivered']), align: 'right' },
            ndrRaised: { value: String(report['NDR Raised']), align: 'right' },
            ndrDelivered: { value: String(report['NDR Delivered']), align: 'right' },
            ndrPending: { value: String(report['NDR Pending']), align: 'right' },
            rto: { value: String(report['RTO']), align: 'right' },
            outForDelivery: { value: String(report['Out For Delivery']), align: 'right' },
            totalShipments: { value: String(report['Total Shipments']), align: 'right' },
        })) || []

    return (
        <Flex justify="center" overflow={'auto'} w={'100%'} h={'250px'}>
            <ChakraTable<typeof tableColumns> columns={tableColumns} data={tableData} />
        </Flex>
    )
}
