import { Box, Center, Flex, Heading, Text } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getCommunicationEventConfiguration } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useRouter } from 'next/router'
import { UseMutationCommunicationChannelConfigurationEvent } from 'page-modules/ndr/hooks/mutations'
import {
    AllEventComponentParams,
    EventConfigDetail,
    EventData,
    Functions,
    UpdateEventConfigPaylod,
} from 'page-modules/settings/components/AllEvents/types/Event'
import { ActionParams, ColumnsData, NewData, actionNewData } from 'page-modules/settings/types/Shared/type'
import React, { useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { useAuthProvider } from 'shared/providers/AuthProvider'

import Actions from '../TableCells/Actions/Actions'
import Name from '../TableCells/Name/Name'
import Status from '../TableCells/Status/Status'
import TemplateId from './TableCells/TemplateId/TemplateId'

type Params = {
    doAction: (params: ActionParams) => any
    updateData: (rowIndex: number, newData: NewData) => any
}

function createColumns(props: Params): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()
    const maxLenght = 4
    return [
        columnHelper.accessor('eventName', {
            cell: (info) => <Name info={info} />,
            header: 'Event Name',
            size: 200,
        }),
        columnHelper.accessor('templateNames', {
            cell: (info) => <TemplateId info={info} maxLength={maxLenght} />,
            header: 'Template ID',
            size: 200,
        }),
        columnHelper.accessor('status', {
            cell: (info) => <Status info={info} updateData={props.updateData} />,
            header: 'Status',
            size: 100,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 200,
        }),
    ]
}
const createPayload = (
    tenantName: string,
    updatedGroup: EventConfigDetail,
    eventIndex: number,
    status: boolean,
): UpdateEventConfigPaylod => {
    const payload: UpdateEventConfigPaylod = {
        tenant_code: tenantName,
        items: [
            {
                tenant_event_id: updatedGroup.eventData[eventIndex].eventId,
                enabled: status,
            },
        ],
    }
    return payload
}
const getEventsConfigrationApiUrl = 'session/api/v1/communication-channel/configuration/events'
export default function AllEvents({ channelCode, providerName }: AllEventComponentParams) {
    const queryClient = useQueryClient()
    const [tableData, setTableData] = useState<Array<EventConfigDetail>>([])
    const mutation = UseMutationCommunicationChannelConfigurationEvent(getEventsConfigrationApiUrl)
    const { tenantName } = useAuthProvider()

    const { isLoading, isError } = useQuery({
        queryKey: ['get-communication-channel-event-config'],
        queryFn: () =>
            getCommunicationEventConfiguration(
                `${getEventsConfigrationApiUrl}?communicationChannelCode=${channelCode}`,
            ),
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
    const handleQuerySuccess = (data: Array<EventConfigDetail>) => {
        const updatedTableData = data
            ? data.map((obj, index) => ({
                  ...obj,
                  eventData: obj.eventData.map((event: EventData) => ({
                      ...event,
                      notificationGroupName: obj.notificationGroupName,
                      groupIndex: index, // Use the index parameter here
                      actions: {
                          outside: [{ actionName: 'viewTemplate', label: 'View Template' }],
                          inside: [],
                      },
                  })),
              }))
            : []
        setTableData(updatedTableData)
    }

    const handlePatchAction = (patchData: UpdateEventConfigPaylod) => {
        // Call the mutation function to perform the patch
        mutation.mutate(patchData, {
            onSuccess: () => {
                queryClient.invalidateQueries(['get-communication-channel-event-config'])
            },
            onError: () => {
                // Handle error cases
                queryClient.invalidateQueries(['get-communication-channel-event-config'])
            },
        })
    }
    const router = useRouter()
    const functions = {
        viewTemplate: (newData: Array<actionNewData>) => {
            setTableData((prevTableData) => {
                const updatedTableData = [...prevTableData]
                const groupIndex =
                    newData.length > 0 && newData[0].groupIndex !== undefined ? newData[0].groupIndex : false
                const rowIndex = newData.length > 0 && newData[0].rowIndex !== undefined ? newData[0].rowIndex : false

                if (groupIndex !== false && groupIndex < updatedTableData.length) {
                    if (
                        updatedTableData[groupIndex].eventData &&
                        rowIndex !== false &&
                        rowIndex >= 0 &&
                        rowIndex < updatedTableData[groupIndex].eventData.length
                    ) {
                        const eventData = updatedTableData[groupIndex].eventData
                        const event = eventData[rowIndex]
                        if (event.eventId) {
                            router.push(`./${channelCode}/templates?eventId=${event.eventId}`)
                        }
                    }
                }
                return updatedTableData
            })
        },
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
            if (
                newData.groupIndex !== undefined &&
                newData.groupIndex >= 0 &&
                newData.groupIndex < updatedTableData.length
            ) {
                if (
                    updatedTableData[newData.groupIndex].eventData &&
                    rowIndex >= 0 &&
                    rowIndex < updatedTableData[newData.groupIndex].eventData.length
                ) {
                    const updatedGroup = updatedTableData[newData.groupIndex]
                    const eventData = [...updatedTableData[newData.groupIndex].eventData]
                    const event = { ...eventData[rowIndex] }
                    event.status = newData.status
                    eventData[rowIndex] = event
                    updatedTableData[newData.groupIndex].eventData = eventData
                    const payload: UpdateEventConfigPaylod = createPayload(
                        tenantName ? tenantName : '',
                        updatedGroup,
                        rowIndex,
                        newData.status,
                    )
                    handlePatchAction(payload)
                }
            }
            return updatedTableData
        })
    }

    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction, updateData: updateData }), [])
    const borderColor = 'var(--chakra-colors-gray-100)' // Use the CSS variable
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
            <Box>
                {providerName && (
                    <Box p={4} bg="blue.600">
                        <Text color="white" fontSize="md" as="span" mr={2}>
                            GateWay:
                        </Text>
                        <Text color="white" fontSize="md" fontWeight="bold" as="span">
                            {providerName}
                        </Text>
                    </Box>
                )}
                {Array.isArray(tableData) &&
                    tableData.map((tdata, index) => (
                        <React.Fragment key={index}>
                            <Heading
                                p={4}
                                style={{
                                    borderBottom: `1px solid ${borderColor}`,
                                    borderTop: `1px solid ${borderColor}`,
                                }}
                                fontSize="xl"
                            >
                                {`${tdata.notificationGroupName} (${tdata.notificationTitle})`}
                            </Heading>
                            <TanstackTable<ColumnsData>
                                key={tdata.notificationGroupName}
                                data={tdata.eventData}
                                columns={memoizedColumns}
                                getRowCanExpand={() => true}
                                strategy="VirtualRows"
                                tableStyles={{ width: '100%' }}
                                tableContainerStyle={{ style: { height: 'auto' } }}
                                headerCellStyles={{ paddingLeft: '1rem' }}
                            />
                        </React.Fragment>
                    ))}
            </Box>
        </Flex>
    )
}
