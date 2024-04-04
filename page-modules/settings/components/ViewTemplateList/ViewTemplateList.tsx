import { Center, Flex } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getCommunicationTemplatesConfiguration } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { UseMutationCommunicationChannelTemplate } from 'page-modules/ndr/hooks/mutations'
import {
    AllTemplateComponentParams,
    DataList,
    Functions,
    ShippingProviderType,
    UpdateStatusPayload,
} from 'page-modules/settings/components/ViewTemplateList/types/TemplateList'
import { ActionParams, ColumnsData, NewData, Params } from 'page-modules/settings/types/Shared/type'
import { useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { useAuthProvider } from 'shared/providers/AuthProvider'

import EventTemplate from '../TableCells/EventTemplate/EventTemplate'
import Name from '../TableCells/Name/Name'
import ShippingProvider from './TableCells/ShippingProvider/ShippingProvider'

function createColumns({}: Params): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()
    return [
        columnHelper.accessor('display_name', {
            cell: (info) => <Name info={info} />,
            header: 'Template Name',
            size: 200,
        }),
        columnHelper.accessor('order_type', {
            cell: (info) => <Name info={info} />,
            header: 'Order Type',
            size: 100,
        }),
        columnHelper.accessor('shipping_providers', {
            cell: (info) => <ShippingProvider info={info} />,
            header: 'Service Provider',
            size: 200,
        }),
        columnHelper.accessor('content', {
            cell: (info) => <EventTemplate info={info} />,
            header: 'Template',
            size: 200,
        }),
        // columnHelper.accessor('status', {
        //     cell: (info) => <Status info={info} updateData={props.updateData}/>,
        //     header: 'Status',
        //     size: 100,
        // })
    ]
}
const getTemplatesConfigrationApiUrl = 'session/api/v1/communication-channel/configuration/events/templates'

export default function ViewTemplateList({ eventId }: AllTemplateComponentParams) {
    const queryClient = useQueryClient()

    const [tableData, setTableData] = useState<Array<DataList>>([])
    const mutation = UseMutationCommunicationChannelTemplate(getTemplatesConfigrationApiUrl)
    const { tenantName } = useAuthProvider()
    const { isLoading, isError } = useQuery({
        queryKey: ['get-communication-channel-template-config'],
        queryFn: () => getCommunicationTemplatesConfiguration(`${getTemplatesConfigrationApiUrl}?event_id=${eventId}`),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error: any) => {
            console.error('An error occurred:', error)
            // You can set state or perform other actions here based on the error
        },
    })
    const handleQuerySuccess = (data: Array<DataList>) => {
        setTableData(data)
    }
    const functions: Functions = {
        delete: (params: Array<any>) => {
            if (params && params.length) {
                // const index: number = params[0].rowIndex
                // console.log(index)
            }
        },
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }
    const handlePatchAction = (patchData: UpdateStatusPayload) => {
        // Call the mutation function to perform the patch
        mutation.mutate(patchData, {
            onSuccess: () => {
                queryClient.invalidateQueries(['get-communication-channel-template-config'])
            },
            onError: () => {
                // Handle error cases
                queryClient.invalidateQueries(['get-communication-channel-template-config'])
            },
        })
    }

    const createPayload = (tenantName: string, templateData: any, status: boolean): UpdateStatusPayload => {
        const payload: UpdateStatusPayload = {
            template_id: templateData.template_id,
            tenant_event_id: eventId,
            tenant_code: tenantName,
            order_type: templateData.order_type,
            shipping_provider_codes: templateData.shipping_providers.map(
                (shippingProvider: ShippingProviderType) => shippingProvider.code,
            ),
            enabled: status,
        }
        return payload
    }
    const updateData = (rowIndex: number, newData: NewData) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData]
            if (rowIndex >= 0 && rowIndex < updatedTableData.length) {
                updatedTableData[rowIndex] = {
                    ...updatedTableData[rowIndex],
                    status: newData.status,
                }
                const templateData = updatedTableData[rowIndex]
                const enabled = updatedTableData[rowIndex].status
                // setTableData(updatedTableData);

                const payload = createPayload(tenantName ? tenantName : '', templateData, enabled)
                handlePatchAction(payload)
            }
            return updatedTableData
        })
    }
    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction, updateData: updateData }), [])
    if (isLoading)
        return (
            <Flex flexDir="column" justifyContent="space-between" h={`100%`} overflow="auto" p="4">
                <FormSkelton rows="2" columns="4" colWidth="200" />
            </Flex>
        )

    if (isError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )
    return (
        <Flex flexDir="column" justifyContent="space-between" h={`100%`} overflow="auto">
            <TanstackTable<ColumnsData>
                data={tableData}
                columns={memoizedColumns}
                getRowCanExpand={() => true}
                strategy="VirtualRows"
                tableStyles={{ width: `100%` }}
                headerCellStyles={{ paddingLeft: '1rem' }}
            />
        </Flex>
    )
}
