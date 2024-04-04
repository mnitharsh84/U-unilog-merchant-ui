import { Center, Flex } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getCommunicationChannelConfiguration } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useRouter } from 'next/router'
import { UseMutationCommunicationChannelConfiguration } from 'page-modules/ndr/hooks/mutations'
import { COMMUNICATION_CHANNEL_ICON_MAP } from 'page-modules/settings/components/AllCommunicationChannelsList/config/CommunicationChannel'
import {
    DataList,
    DataType,
    Functions,
    UpdateStatusPayload,
} from 'page-modules/settings/components/AllCommunicationChannelsList/types/CommunicationChannelsColumns'
import { ActionParams, ColumnsData, NewData, Params } from 'page-modules/settings/types/Shared/type'
import { useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { useAuthProvider } from 'shared/providers/AuthProvider'

import Actions from '../TableCells/Actions/Actions'
import ConfiguredEvents from '../TableCells/ConfiguredEvents/ConfiguredEvents'
import Name from '../TableCells/Name/Name'
import Status from '../TableCells/Status/Status'

const maxLength = 5
function createColumns(props: Params): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()

    return [
        columnHelper.accessor('channelCode', {
            cell: (info) => <Name info={info} iconMap={COMMUNICATION_CHANNEL_ICON_MAP} />,
            header: 'Communication Channel Name',
            size: 200,
        }),
        columnHelper.accessor('status', {
            cell: (info) => <Status info={info} updateData={props.updateData} />,
            header: 'Status',
            size: 100,
        }),
        columnHelper.accessor('configuredEvents', {
            cell: (info) => <ConfiguredEvents info={info} maxLength={maxLength} />,
            header: 'Configured Events',
            size: 300,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 200,
        }),
    ]
}
const createPayload = (tenantName: string, communicationChannelId: string, status: boolean) => {
    const payload = {
        tenant_code: tenantName,
        items: [
            {
                communication_channel_id: communicationChannelId,
                enabled: status,
            },
        ],
    }
    return payload
}
export default function AllCommunicationChannelsList() {
    const queryClient = useQueryClient()
    const [tableData, setTableData] = useState<Array<DataList>>([])

    const router = useRouter()
    const { tenantName } = useAuthProvider()
    const getCommunicationChannelConfigurationApiUrl = `session/api/v1/communication-channel/configuration`
    const mutation = UseMutationCommunicationChannelConfiguration(getCommunicationChannelConfigurationApiUrl)
    const { isLoading, isError } = useQuery({
        queryKey: ['get-communication-channel-config'],
        queryFn: () => getCommunicationChannelConfiguration(getCommunicationChannelConfigurationApiUrl),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error) => {
            console.error('An error occurred:', error)
            // You can set state or perform other actions here based on the error
        },
    })
    const handleQuerySuccess = (data: DataType) => {
        const updatedTableData = data
            ? data.data.map((obj) => ({
                  ...obj,
                  actions: { outside: [{ actionName: 'redirectToEvent', label: 'View Detail' }], inside: [] },
              }))
            : []
        setTableData(updatedTableData)
    }

    const handlePatchAction = (patchData: UpdateStatusPayload) => {
        // Call the mutation function to perform the patch
        mutation.mutate(patchData, {
            onError: () => {
                // Handle error cases
                queryClient.invalidateQueries(['get-communication-channel-config'])
            },
        })
    }

    const redirectToEvent = (params: Array<any>) => {
        if (params && params.length) {
            const index: number = params[0].rowIndex
            setTableData((prevTableData) => {
                const channelName = prevTableData[index].channelCode
                const communicationProviderName = prevTableData[index].communicationProviderName
                if (channelName) {
                    router.push(`./communicationChannels/${channelName}?pName=${communicationProviderName}`)
                }
                return prevTableData // Return the state to ensure the state is not modified
            })
        }
    }

    const functions: Functions = {
        redirectToEvent: redirectToEvent,
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }

    const updateData = (rowIndex: number, newData: NewData) => {
        setTableData((prevTableData) => {
            const updatedTableData = [...prevTableData]
            if (rowIndex >= 0 && rowIndex < updatedTableData.length) {
                updatedTableData[rowIndex] = {
                    ...updatedTableData[rowIndex],
                    status: newData.status,
                }
                const communicationChannelId = updatedTableData[rowIndex].tenantCommunicationChannelId
                const enabled = updatedTableData[rowIndex].status
                // setTableData(updatedTableData);

                const payload = createPayload(tenantName ? tenantName : '', communicationChannelId, enabled)
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
    return tableData && tableData.length ? (
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
    ) : null
}
