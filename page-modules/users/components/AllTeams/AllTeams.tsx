import { Center, Flex } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getAllTeams } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useRouter } from 'next/router'
import { ActionData, ActionParams, TeamApiResponse } from 'page-modules/users/type/type'
import { useEffect, useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { ColumnsData } from 'shared/types/table'

import Actions from '../TableCells/Actions/Actions'
import ListValue from '../TableCells/ListValue/ListValue'
import TextValue from '../TableCells/TextValue/TextValue'
import { Functions, InitialState } from './type/AllTeams'

type Params = {
    doAction: (params: ActionParams) => any
}
const maxLength = 3
function createColumns(props: Params): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()

    return [
        columnHelper.accessor('teamName', {
            cell: (info) => <TextValue info={info} />,
            header: 'Name',
            size: 100,
        }),
        columnHelper.accessor('roles', {
            cell: (info) => <ListValue info={info} maxLength={maxLength} />,
            header: 'Assigned Roles',
            size: 200,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 200,
        }),
    ]
}
type AllTeamsParams = {
    doActionAllTeam: (params: any) => any
    refetchAllTeamsQuery: boolean
    refetchCompleted: () => any
}
export default function AllTeams({ doActionAllTeam, refetchAllTeamsQuery, refetchCompleted }: AllTeamsParams) {
    const queryClient = useQueryClient()
    const [tableData, setTableData] = useState<Array<InitialState>>([])
    useEffect(() => {
        if (refetchAllTeamsQuery) {
            queryClient.invalidateQueries(['get-rms-teams'])
        }
    }, [refetchAllTeamsQuery])

    const router = useRouter()
    const getAllTeamsApiUrl = `session/api/v1/rms/team`
    const [customIsLoading, setCustomIsLoading] = useState<boolean>(true)

    const { isError } = useQuery({
        queryKey: ['get-rms-teams'],
        queryFn: () => getAllTeams(getAllTeamsApiUrl),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error) => {
            setCustomIsLoading(false)
            console.error('An error occurred:', error)
            // You can set state or perform other actions here based on the error
        },
    })

    const handleQuerySuccess = (data: TeamApiResponse) => {
        const updatedTableData =
            data && Array.isArray(data.data)
                ? data.data.map((obj) => ({
                      ...obj,
                      actions: {
                          outside: [
                              { actionName: 'edit', label: 'Manage Access' },
                              { actionName: 'viewUsers', label: 'Manage Users' },
                          ],
                          inside: [{ actionName: 'delete', label: 'Remove Team' }],
                      },
                  }))
                : []
        setTableData(updatedTableData)
        refetchCompleted()
        setCustomIsLoading(false)
    }

    const editTeam = (params: Array<ActionData>) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const team = prevTableData[rowIndex]
                    doActionAllTeam({ action: 'editTeam', team: team })
                }
                return prevTableData
            })
        }
    }

    const deleteTeam = (params: Array<ActionData>) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const team = prevTableData[rowIndex]
                    doActionAllTeam({ action: 'deleteTeam', team: team })
                }

                return prevTableData
            })
        }
    }

    const viewUsers = (params: Array<ActionData>) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const team = prevTableData[rowIndex]
                    if (team && team.teamId) {
                        router.push(`./teams/allUsers?teamId=${team.teamId}&teamName=${team.teamName}`)
                    }
                }
                return prevTableData
            })
        }
    }

    const functions: Functions = {
        edit: editTeam,
        delete: deleteTeam,
        viewUsers: viewUsers,
    }

    const doAction = (action: ActionParams) => {
        if (functions[action.fxnName as keyof Functions]) {
            const params: any[] = action.fxnParams || [] // Define the params as an array
            functions[action.fxnName as keyof Functions](params)
        }
    }

    const memoizedColumns = useMemo(() => createColumns({ doAction: doAction }), [])
    if (customIsLoading)
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
