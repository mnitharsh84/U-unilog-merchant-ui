import { Box, Center, Flex } from '@chakra-ui/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import router from 'next/router'
import { useFilterContext } from 'page-modules/return/FilterProvider'
import { ReturnTabStatusMappingWithRoute } from 'page-modules/return/config/config'
import { useSellerReturnData } from 'page-modules/return/hooks/queries'
import { Functions, RMSTYPE, RetrunsColumns, ReturnTabStatus, SellerReturnOrder } from 'page-modules/return/type/return'
import { sanitiseData } from 'page-modules/return/utils'
import { useEffect, useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import DatatableSkeleton from 'shared/components/Skeletons/Datatable'
import { ActionParams } from 'shared/types/table'

import MultipleTextCell from '../TableCells/MultipleTextCell/MultipleTextCell'
import ProductImage from '../TableCells/ProductImage/ProductImage'
import TextCell from '../TableCells/TextCell/TextCell'
import TextCellWithAction from '../TableCells/TextCellWithAction/TextCellWithAction'
import TextCellWithMaxWidth from '../TableCells/TextCellWithMaxWidth/TextCellWithMaxWidth'

type Params = {
    doAction: (params: ActionParams) => any
    tabStatus: string
}

function createColumns(props: Params): ColumnDef<RetrunsColumns, any>[] {
    const columnHelper = createColumnHelper<RetrunsColumns>()

    const columnsList: ColumnDef<RetrunsColumns, any>[] = [
        columnHelper.accessor('request_id', {
            cell: (info) => (
                <TextCellWithMaxWidth info={info} doAction={props.doAction} fxnName="viewOrder" maxWidth="100px" />
            ),
            header: 'Request ID',
            size: 100,
        }),
        columnHelper.accessor('request_items', {
            cell: (info) => <ProductImage info={info} />,
            header: 'Product',
            size: 150,
        }),
        columnHelper.accessor('display_order_code', {
            cell: (info) => <TextCellWithAction info={info} doAction={props.doAction} fxnName="viewOrder" />,
            header: 'Order',
            size: 60,
        }),
        columnHelper.accessor('sale_order_code', {
            cell: (info) => <TextCellWithAction info={info} doAction={props.doAction} fxnName="viewOrder" />,
            header: 'Sale Order Code',
            size: 60,
        }),
        columnHelper.accessor('order_created_at', {
            cell: (info) => <TextCell info={info} />,
            header: 'Order Created',
            size: 80,
        }),
        columnHelper.accessor('order_fulfillment_tat', {
            cell: (info) => <TextCell info={info} />,
            header: 'Order Fulfillment Date',
            size: 80,
        }),
        columnHelper.accessor('refund_mode', {
            cell: (info) => <TextCell info={info} />,
            header: 'Refund Mode',
            size: 70,
        }),
        columnHelper.accessor('shipping_option', {
            cell: (info) => <TextCell info={info} />,
            header: 'Shipping Option',
            size: 70,
        }),
        columnHelper.accessor('customer_email', {
            cell: (info) => <TextCell info={info} />,
            header: 'Customer Email',
            size: 100,
        }),
        columnHelper.accessor('customer_phone', {
            cell: (info) => <TextCell info={info} />,
            header: 'Customer Phone',
            size: 80,
        }),
        columnHelper.accessor('created_at', {
            cell: (info) => <TextCell info={info} />,
            header: 'Return Created',
            size: 80,
        }),
    ]
    if (props.tabStatus.toUpperCase() === 'APPROVED' || props.tabStatus.toUpperCase() === 'COMPLETED') {
        const refundStatuscolumn = columnHelper.accessor('refund_status', {
            cell: (info) => <TextCell info={info} />,
            header: 'Refund Status',
            size: 80,
        })
        columnsList.splice(4, 0, refundStatuscolumn)

        const column = columnHelper.accessor('reverse_pickup_code', {
            cell: (info) => <TextCell info={info} />,
            header: 'Reverse Pickup Code',
            size: 80,
        })
        columnsList.splice(10, 0, column)
        const omsStatusColumn = columnHelper.accessor('oms_rvp_status', {
            cell: (info) => <TextCell info={info} />,
            header: 'Oms Status',
            size: 80,
        })
        columnsList.splice(11, 0, omsStatusColumn)

        const shippingProviderField = columnHelper.accessor('shipping_provider', {
            cell: (info) => <MultipleTextCell info={info} />,
            header: 'Shipping Details',
            size: 150,
        })
        columnsList.splice(12, 0, shippingProviderField)
    }
    return columnsList
}

type Props = {
    tabStatus: ReturnTabStatus
    rmsType: RMSTYPE
}
export default function ReturnsList({ tabStatus, rmsType }: Props) {
    const { pageFilters, customFilters, setItems } = useFilterContext()
    const [, setReturnOrders] = useState({})

    const { isLoading, isError, data } = useSellerReturnData(tabStatus, rmsType, customFilters, pageFilters)
    const viewOrder = (params: any) => {
        const saleOrderCode = params[0].saleOrderCode
        const requestId = params[0].value
        const refundStatus = params[0].refund_status
        if (saleOrderCode) {
            router.push(
                `./${ReturnTabStatusMappingWithRoute[tabStatus]}/${saleOrderCode}?requestId=${requestId}&viewType=details&refundStatus=${refundStatus}`,
            )
        }
    }
    const functions: Functions = {
        viewOrder: viewOrder,
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }
    const memoizedData = useMemo(() => sanitiseData(data), [data])
    const updateReturnOrders = (data: Array<SellerReturnOrder>) => {
        const returnOrdersMap: { [key: string]: SellerReturnOrder } = {}
        data.map((returnOrder: SellerReturnOrder) => {
            returnOrdersMap[returnOrder.display_order_code] = returnOrder
        })
        setReturnOrders(returnOrdersMap)
    }
    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction, tabStatus }), [])

    useEffect(() => {
        if (data?.total) setItems(data?.total)
        if (data?.data) updateReturnOrders(data.data)
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
            <TanstackTable<RetrunsColumns>
                data={memoizedData}
                columns={memoizedColumns}
                getRowCanExpand={() => true}
                strategy="VirtualRows"
                tableStyles={{ minWidth: '100%' }}
            />
        </Flex>
    )
}
