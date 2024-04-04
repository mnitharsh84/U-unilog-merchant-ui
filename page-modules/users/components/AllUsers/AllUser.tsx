import { Center, Flex } from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { getTeamUsers } from 'apis/get'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { ActionData, ActionParams } from 'page-modules/users/type/type'
import { useEffect, useMemo, useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { ColumnsData } from 'shared/types/table'

import Actions from '../TableCells/Actions/Actions'
import TextValue from '../TableCells/TextValue/TextValue'
import { Functions, InitialState, User } from './type/AllUsers'

type AllUsersParams = {
    teamId: string
    doActionAllUser: (params: any) => any
    refetchAllTeamsQuery: boolean
    refetchCompleted: () => any
}
type Params = {
    doAction: (params: ActionParams) => any
}
function createColumns(props: Params): ColumnDef<ColumnsData, any>[] {
    const columnHelper = createColumnHelper<ColumnsData>()

    return [
        columnHelper.accessor('username', {
            cell: (info) => <TextValue info={info} />,
            header: 'Username',
            size: 200,
        }),
        columnHelper.accessor('email', {
            cell: (info) => <TextValue info={info} />,
            header: 'Email',
            size: 200,
        }),
        columnHelper.accessor('firstName', {
            cell: (info) => <TextValue info={info} />,
            header: 'First Name',
            size: 200,
        }),
        columnHelper.accessor('lastName', {
            cell: (info) => <TextValue info={info} />,
            header: 'Last Name',
            size: 200,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => <Actions doAction={props.doAction} info={info} />,
            header: 'Actions',
            size: 200,
        }),
    ]
}

export default function AllUsers({ teamId, refetchAllTeamsQuery, refetchCompleted, doActionAllUser }: AllUsersParams) {
    const queryClient = useQueryClient()
    const [tableData, setTableData] = useState<Array<InitialState>>([])
    const getAllUsersApiUrl = `session/api/v1/rms/team/user?team_id=${teamId}`
    const [customIsLoading, setCustomIsLoading] = useState<boolean>(true)

    const { isError } = useQuery({
        queryKey: ['get-all-users-api'],
        queryFn: () => getTeamUsers(getAllUsersApiUrl),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error) => {
            console.error('An error occurred:', error)
            setCustomIsLoading(false)
            // You can set state or perform other actions here based on the error
        },
    })
    const handleQuerySuccess = (data: any) => {
        if (data.data && data.data.users) {
            const updatedTableData = data.data.users.map((obj: User) => ({
                ...obj,
                actions: {
                    outside: [
                        { actionName: 'edit', label: 'Edit' },
                        { actionName: 'delete', label: 'Delete' },
                    ],
                    inside: [],
                },
            }))

            setTableData(updatedTableData)
            refetchCompleted()
        }
        setCustomIsLoading(false)
    }

    useEffect(() => {
        if (refetchAllTeamsQuery) {
            queryClient.invalidateQueries(['get-all-users-api'])
        }
    }, [refetchAllTeamsQuery])

    const editTeam = (params: ActionData[]) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const userWithAction = { ...prevTableData[rowIndex] }
                    const user = getUserWithoutActions(userWithAction)
                    doActionAllUser({ action: 'editUser', user: user })
                }
                return prevTableData
            })
        }
    }

    const getUserWithoutActions = (user: User) => {
        const newUser: User = {} as User
        for (const key in user) {
            if (key !== 'actions') {
                newUser[key as keyof User] = user[key as keyof User]
            }
        }
        return newUser
    }

    const deleteUser = (params: ActionData[]) => {
        if (params && params.length) {
            const rowIndex = params[0].rowIndex
            setTableData((prevTableData) => {
                if (rowIndex >= 0 && rowIndex < prevTableData.length) {
                    const user = { ...prevTableData[rowIndex] }
                    const userWithoutAction = getUserWithoutActions(user)
                    doActionAllUser({ action: 'deleteUser', user: userWithoutAction })
                }
                return prevTableData
            })
        }
    }

    const functions: Functions = {
        edit: editTeam,
        delete: deleteUser,
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
