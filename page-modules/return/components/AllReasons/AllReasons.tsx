import { Center, Flex } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getRmsReason } from 'apis/get'
import { RMS_REASON_API } from 'apis/url'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useMutationRmsReason } from 'page-modules/return/hooks/mutations'
import { ActionData, AllReasonsParams } from 'page-modules/return/type/return'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { ActionParams, ColumnsData } from 'shared/types/table'

import Actions from '../TableCells/Actions/Actions'
import Status from '../TableCells/Status/Status'
import TextValue from '../TableCells/TextValue/TextValue'
import { Functions, PropertyField, Reason, RemoveReasonAPiPayload } from './type/AllReasons'

function createColumns(props: any): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()

    return [
        columnHelper.accessor('text', {
            cell: (info) => <TextValue info={info} />,
            header: 'Reason Name',
            size: 100,
        }),
        columnHelper.accessor('status', {
            cell: (info) => <Status info={info} />,
            header: 'Status',
            size: 100,
        }),
        columnHelper.accessor('rms_type', {
            cell: (info) => <TextValue info={info} />,
            header: 'Reason Type',
            size: 100,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 200,
        }),
    ]
}

export default function AllReasons({ doActionReasons, refetchAllReasonsQuery, refetchCompleted }: AllReasonsParams) {
    const [tableData, setTableData] = useState<Array<any>>([])
    const [, setServerData] = useState<{ [key: string]: any }>({})

    const queryClient = useQueryClient()
    const mutation = useMutationRmsReason(RMS_REASON_API)
    useEffect(() => {
        if (refetchAllReasonsQuery) {
            queryClient.invalidateQueries(['get-rms-reason'])
        }
    }, [refetchAllReasonsQuery])
    const { isLoading, isError } = useQuery({
        queryKey: ['get-rms-reason'],
        queryFn: () => getRmsReason(`${RMS_REASON_API}`),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            handleQuerySuccess(data)
        },
        onError: (error) => {
            console.error('An error occurred:', error)
            // You can set state or perform other actions here based on the error
        },
    })
    const handleQuerySuccess = (data: Array<Reason>) => {
        const allReasonsServerData = getServerData(data)
        setServerData(allReasonsServerData)
        const updatedTableData = Array.isArray(data)
            ? data.map((obj) => ({
                  id: obj.id,
                  text: obj.text,
                  status: obj.status,
                  rms_type: obj.rms_type,
                  is_metadata_global: obj.is_metadata_global,
                  metadata_version: obj.metadata_version,
                  actions: {
                      outside: [
                          { actionName: 'edit', label: 'Edit' },
                          { actionName: 'remove', label: 'Remove Reason' },
                      ],
                  },
              }))
            : []
        setTableData(updatedTableData)
        refetchCompleted()
    }
    const getServerDataForMultiSelect = (data: PropertyField, serverData: { [key: string]: any }) => {
        const key: string = data.code
        let values: string[] = []
        if (data.selected_values) {
            for (const selectedValue of data.selected_values) {
                if (selectedValue.code) {
                    const value = `${key}|${selectedValue.code}`
                    values = [...values, value]
                    if (selectedValue.input_prompt) {
                        getServerDateForInputPrompt(value, selectedValue.input_prompt, serverData)
                    }
                }
            }
        }
        serverData[key] = values
    }
    const getServerDateForInputPrompt = (key: string, data: any, serverData: { [key: string]: any }) => {
        if (Array.isArray(data.str_values)) {
            serverData[key] = data.str_values.map((data: { [key: string]: any }) => data.code)
        }
    }
    const getServerDataForSelect = (data: PropertyField, serverData: { [key: string]: any }) => {
        const key: string = data.code
        if (data.selected_value && key) {
            if (data.selected_value.code) {
                if (data.selected_value.input_prompt) {
                    serverData[key] = `${key}|${data.selected_value.code}`
                    getServerDateForInputPrompt(serverData[key], data.selected_value.input_prompt, serverData)
                } else {
                    serverData[key] = data.selected_value.code
                }
            }
        }
    }
    const getServerDataForBoolean = (data: PropertyField, serverData: { [key: string]: any }) => {
        const key: string = data.code
        if (data.checked && key) {
            if (data.checked.input_prompt && data.checked.code) {
                serverData[key] = `${key}|${data.checked.code}`
                getServerDateForInputPrompt(serverData[key], data.checked.input_prompt, serverData)
            } else {
                serverData[key] = data.checked.checked
            }
        }
    }
    const getServerDataForProperties = (data: PropertyField[], serverData: { [key: string]: any }) => {
        for (const reason of data) {
            if (reason.input_type === 'MULTI_SELECT_BOX') {
                getServerDataForMultiSelect(reason, serverData)
            } else if (reason.input_type === 'SELECT_BOX') {
                getServerDataForSelect(reason, serverData)
            } else if (reason.input_type === 'BOOLEAN') {
                getServerDataForBoolean(reason, serverData)
            } else if (reason.input_type === 'INPUT_BOX') {
                serverData[reason.code] = reason.entered_value
            }
        }
    }

    const getServerData = (data: Array<Reason>) => {
        const allReasonsServerData: { [key: string]: any } = {}

        for (const reason of data) {
            const serverData: { [key: string]: any } = {}
            for (const key in reason) {
                if (key !== 'properties') {
                    const actualKey: string = key === 'text' ? 'name' : key
                    serverData[actualKey] = reason[key as keyof Reason]
                } else {
                    getServerDataForProperties(reason[key], serverData)
                }
            }
            allReasonsServerData[reason.id] = serverData
        }
        return allReasonsServerData
    }

    const editReason = (params: Array<ActionData>) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const reason = prevTableData[rowIndex]
                    if (reason.id) {
                        setServerData((preServerData) => {
                            const reasonServerData = preServerData[reason.id]
                            doActionReasons({ action: 'editReason', reason: reasonServerData })
                            return preServerData
                        })
                    }
                }
                return prevTableData
            })
        }
    }
    const removeReason = (params: Array<ActionData>) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const reason = prevTableData[rowIndex]
                    if (reason.id) {
                        setServerData((preServerData) => {
                            const reasonServerData = preServerData[reason.id]
                            const payload: RemoveReasonAPiPayload = {
                                status: false,
                                id: reasonServerData.id,
                                rms_type: reason.rms_type,
                            }
                            callDeleteReasonApi(payload)
                            return preServerData
                        })
                    }
                }
                return prevTableData
            })
        }
    }
    const callDeleteReasonApi = (payload: RemoveReasonAPiPayload) => {
        mutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    const message = data.message ? data.message : 'Reason removed successfully!'
                    toast.success(message)
                    queryClient.invalidateQueries(['get-rms-reason'])
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }
    const functions: Functions = {
        edit: editReason,
        remove: removeReason,
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }
    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction }), [])

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
    return tableData ? (
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
