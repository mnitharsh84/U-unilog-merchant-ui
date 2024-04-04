import { Box, Center, Flex } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useFilterContext } from 'page-modules/buyer/FilterProvider'
import { UseMutationBuyerNdrRequest, UseMutationBuyerNdrRequestDiscared } from 'page-modules/buyer/hooks/mutation'
import { useBuyerRequestData } from 'page-modules/buyer/hooks/qweries'
import { BuyerColumns, BuyerRequestClosedApiResponse, BuyerTabStatus, Functions } from 'page-modules/buyer/types/buyer'
import { useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import DatatableSkeleton from 'shared/components/Skeletons/Datatable'
import { ActionParams } from 'shared/types/table'

import { sanitiseData } from '../../utils'
import Actions from '../TableCells/Actions/Actions'
import CustomerDetails from '../TableCells/CustomerDetails/CustomerDetails'
import DeliveryAddress from '../TableCells/DeliveryAddress/DeliveryAddress'
import TextValue from '../TableCells/TextValue/TextValue'
import ShipmentDetails from '../TableCells/shippingDetails/ShipmentDetails'

type Params = {
    doAction: (params: ActionParams) => void
    tabStatus: string
}

function createColumns(props: Params): ColumnDef<BuyerColumns, any>[] {
    const columnHelper = createColumnHelper<BuyerColumns>()
    const columnsList = [
        columnHelper.accessor('ShipmentDetails', {
            cell: (info) => <ShipmentDetails info={info} />,
            header: 'Shipment Details',
            size: 80,
        }),
        columnHelper.accessor('status', {
            cell: (info) => <TextValue info={info} />,
            header: 'Status',
            size: 80,
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
        columnHelper.accessor('subRemark', {
            cell: (info) => <TextValue info={info} />,
            header: 'Customer Query',
            size: 300,
        }),
        columnHelper.accessor('created_at', {
            cell: (info) => <TextValue info={info} />,
            header: 'Created At',
            size: 80,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 100,
        }),
    ]
    if (props.tabStatus === 'REATTEMPT') {
        const preferredDate = columnHelper.accessor('preferredDate', {
            cell: (info) => <TextValue info={info} />,
            header: 'Preferred Delivery Date',
            size: 150,
        })
        columnsList.splice(5, 0, preferredDate)
    }
    return columnsList
}

type Props = {
    tabStatus: BuyerTabStatus
}
const buyerNdrRequest = 'session/api/v1/ndr/buyer-ndr-request/closed'
const buyerNdrRequestDiscared = 'session/api/v1/ndr/buyer-ndr-request/discarded'

export default function BuyerRequests({ tabStatus }: Props) {
    const { pageFilters, customFilters, setItems } = useFilterContext()
    const mutation = UseMutationBuyerNdrRequest(buyerNdrRequest)
    const mutationDiscared = UseMutationBuyerNdrRequestDiscared(buyerNdrRequestDiscared)
    const queryClient = useQueryClient()
    const { isLoading, isError, data } = useBuyerRequestData(tabStatus, customFilters, pageFilters)
    const closeRequest = (rowData: any) => {
        const payload = [rowData[0].original.id]
        mutation.mutate(payload, {
            onSuccess: (data: BuyerRequestClosedApiResponse[]) => {
                if (data && data[0]) {
                    toast.success(data[0]?.message)
                }
                queryClient.invalidateQueries(['buyer-requests'])
            },
        })
    }
    const discardRequest = (rowData: any) => {
        const payload = [rowData[0].original.id]
        mutationDiscared.mutate(payload, {
            onSuccess: () => {
                queryClient.invalidateQueries(['buyer-requests'])
            },
        })
    }
    const functions: Functions = {
        CLOSE: closeRequest,
        DISCARD: discardRequest,
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }
    const memoizedData = useMemo(() => sanitiseData(data, tabStatus), [data, tabStatus])

    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction, tabStatus }), [])
    useEffect(() => {
        if (data?.meta) setItems(data?.meta?.total)
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
            <TanstackTable<BuyerColumns>
                data={memoizedData}
                columns={memoizedColumns}
                getRowCanExpand={() => true}
                strategy="VirtualRows"
                tableStyles={{ minWidth: '100%' }}
            />
        </Flex>
    )
}
