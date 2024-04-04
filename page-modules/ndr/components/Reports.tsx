import { Box, Center, Flex } from '@chakra-ui/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { NdrTabStatus } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useEffect, useMemo } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import DatatableSkeleton from 'shared/components/Skeletons/Datatable'

import { useFilterContext } from '../FilterProvider'
import { useReports } from '../hooks/queries'
import { ReportsColumns } from '../types/reports'
import { sanitiseData } from '../utils'
import Actions from './TableCells/Actions'
import CustomerDetails from './TableCells/CustomerDetails'
import DeliveryAddress from './TableCells/DeliveryAddress'
// import FieldExecutiveInfo from './TableCells/FieldExecutiveInfo'
import HistoryRow from './TableCells/HistoryRow'
import LastActionBy from './TableCells/LastActionBy'
import NdrDetails from './TableCells/NdrDetails'
import OrderDetails from './TableCells/OrderDetails'
import ShipmentDetails from './TableCells/ShipmentDetails'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Params = {
    doAction: (params: { [key: string]: string }) => any
}
function createColumns(props: Params): ColumnDef<ReportsColumns, any>[] {
    const columnHelper = createColumnHelper<ReportsColumns>()

    return [
        columnHelper.accessor('ndrDetails', {
            cell: (info) => <NdrDetails info={info} />,
            header: 'NDR Details',
            size: 300,
        }),
        columnHelper.accessor('orderDetails', {
            cell: (info) => <OrderDetails info={info} />,
            header: 'Order Details',
            size: 200,
        }),
        columnHelper.accessor('customerDetails', {
            cell: (info) => <CustomerDetails info={info} />,
            header: 'Customer Details',
            size: 300,
        }),
        columnHelper.accessor('deliveryAddress', {
            cell: (info) => <DeliveryAddress info={info} />,
            header: 'Delivery Address',
            size: 300,
        }),
        // columnHelper.accessor('fieldExecutiveInfo', {
        //     cell: (info) => <FieldExecutiveInfo info={info} />,
        //     header: 'Field Executive Info',
        //     size: 300,
        // }),
        columnHelper.accessor('shipmentDetails', {
            cell: (info) => <ShipmentDetails info={info} />,
            header: 'Shipment Details',
            size: 200,
        }),
        columnHelper.accessor('lastActionBy', {
            cell: (info) => <LastActionBy info={info} />,
            header: 'Last Action By',
            size: 200,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 100,
        }),
    ]
}

type Props = {
    tabStatus: NdrTabStatus
}
export default function Reports({ tabStatus }: Props) {
    const { pageFilters, customFilters, setItems } = useFilterContext()
    const { isLoading, isError, data, refetch } = useReports(tabStatus, customFilters, pageFilters)
    const doAction = () => {
        refetch()
    }
    const memoizedData = useMemo(() => sanitiseData(data), [data])
    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction }), [])

    useEffect(() => {
        if (data?.meta.total) setItems(data?.meta.total)
    }, [data])

    if (isLoading)
        return (
            <Box w={'100%'} h={'90%'} mt={4}>
                <DatatableSkeleton rows={6} columns={8}></DatatableSkeleton>
            </Box>
        )

    if (isError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )

    return (
        <Flex
            flexDir="column"
            justifyContent="space-between"
            h={`100%`}
            overflow="auto"
            border="1px solid var(--chakra-colors-gray-100)"
        >
            <TanstackTable<ReportsColumns>
                data={memoizedData}
                columns={memoizedColumns}
                getRowCanExpand={() => true}
                renderSubComponent={(row) => <HistoryRow id={memoizedData.at(row.index)?.historyRow || ''} />}
                strategy="VirtualRows"
            />
        </Flex>
    )
}
