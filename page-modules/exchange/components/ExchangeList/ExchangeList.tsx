import { Box, Center, Flex } from '@chakra-ui/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import router from 'next/router'
import { useFilterContext } from 'page-modules/exchange/FilterProvider'
import { ExchangeTabStatusMappingWithRoute } from 'page-modules/exchange/config/config'
import { useSellerExchangeData } from 'page-modules/exchange/hooks/queries'
import { ExchangeTabStatus } from 'page-modules/exchange/type/exchange'
import { ExchangeColumns, ExchangeData, Functions, RMSTYPE } from 'page-modules/exchange/type/exchange'
import { sanitiseData } from 'page-modules/exchange/utils'
import { useEffect, useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import DatatableSkeleton from 'shared/components/Skeletons/Datatable'
import { ActionParams } from 'shared/types/table'

import ProductImage from '../TableCells/ProductImage/ProductImage'
import TextCell from '../TableCells/TextCell/TextCell'
import TextCellWithAction from '../TableCells/TextCellWithAction/TextCellWithAction'
import TextCellWithMaxWidth from '../TableCells/TextCellWithMaxWidth/TextCellWithMaxWidth'

type Params = {
    doAction: (params: ActionParams) => void
    tabStatus: string
}

function createColumns(props: Params): ColumnDef<ExchangeColumns, any>[] {
    const columnHelper = createColumnHelper<ExchangeColumns>()

    const columnsList = [
        columnHelper.accessor('request_id', {
            cell: (info) => (
                <TextCellWithMaxWidth info={info} doAction={props.doAction} fxnName="viewOrder" maxWidth="100px" />
            ),
            header: 'Request ID',
            size: 100,
        }),
        columnHelper.accessor('exchange_items', {
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
        columnHelper.accessor('return_created_at', {
            cell: (info) => <TextCell info={info} />,
            header: 'Exchange Created',
            size: 80,
        }),
    ]
    if (props.tabStatus.toUpperCase() === 'APPROVED' || props.tabStatus.toUpperCase() === 'COMPLETED') {
        const replacementSaleOrderColumn = columnHelper.accessor('replacement_sale_order_code', {
            cell: (info) => <TextCell info={info} />,
            header: 'Replacement Sale Order Code',
            size: 60,
        })
        columnsList.splice(4, 0, replacementSaleOrderColumn)

        const column = columnHelper.accessor('reverse_pickup_code', {
            cell: (info) => <TextCell info={info} />,
            header: 'Reverse Pickup Code',
            size: 80,
        })
        columnsList.splice(10, 0, column)
    }
    return columnsList
}

type Props = {
    tabStatus: ExchangeTabStatus
    rmsType: RMSTYPE
}
export default function ExchangeList({ tabStatus, rmsType }: Props) {
    const { pageFilters, customFilters, setItems } = useFilterContext()
    const [, setReturnOrders] = useState({})

    const { isLoading, isError, data } = useSellerExchangeData(tabStatus, rmsType, customFilters, pageFilters)
    const viewOrder = (params: any) => {
        const saleOrderCode = params[0].saleOrderCode
        const requestId = params[0].value
        const refundStatus = params[0].refund_status
        if (saleOrderCode) {
            router.push(
                `./${ExchangeTabStatusMappingWithRoute[tabStatus]}/view?requestId=${requestId}&orderId=${saleOrderCode}&viewType=details&refundStatus=${refundStatus}`,
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
    const updateReturnOrders = (data: Array<ExchangeData>) => {
        const returnOrdersMap: { [key: string]: ExchangeData } = {}
        data.map((returnOrder: ExchangeData) => {
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
            <TanstackTable<ExchangeColumns>
                data={memoizedData}
                columns={memoizedColumns}
                getRowCanExpand={() => true}
                strategy="VirtualRows"
                tableStyles={{ minWidth: '100%' }}
            />
        </Flex>
    )
}
