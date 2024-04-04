import { Box, Button } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getAllRoles } from 'apis/get'
import AddTeam from 'page-modules/users/components/AddTeam/AddTeam'
import AllTeams from 'page-modules/users/components/AllTeams/AllTeams'
import { UseMutationCreateTeam, UseMutationEditTeam } from 'page-modules/users/hooks/mutations'
// import { useAuthProvider } from "shared/providers/AuthProvider";
import { DoActionParams, createTeamFormData, createTeamPayload, editTeamPayload } from 'page-modules/users/type/teams'
import { RolesApiResponseType, RolesType, TeamType } from 'page-modules/users/type/type'
import { useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

type stateData = {
    name: string
    roleCodes: RolesType[]
    selectedRoleCodes: RolesType[]
    title: string
    mode: string
    id: string
    enabled: boolean
}

const createPayload = (formdata: createTeamFormData, selectedRoles: Array<RolesType> | undefined) => {
    return {
        teamName: formdata.name,
        roleCodes: Array.isArray(selectedRoles) ? selectedRoles.map((roles) => roles.code) : [],
    }
}

const createDeletePayload = (data: TeamType): editTeamPayload => {
    return {
        teamId: data.teamId,
        teamName: data.teamName,
        enable: false,
        roleCodes: Array.isArray(data.roles) ? data.roles.map((role: RolesType) => role.code) : [],
    }
}
export default function Teams() {
    const [initialData, setInitialData] = useState<stateData>({
        name: '',
        roleCodes: [],
        selectedRoleCodes: [],
        title: '',
        mode: '',
        id: '',
        enabled: false,
    })
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [refetchAllTeamsQuery, setRefetchAllTeamsQuery] = useState<boolean>(false)

    // const { tenantName } = useAuthProvider()
    const createTeamApiUrl = 'session/api/v1/rms/team'
    const getAllRolesApiUrl = 'session/api/v1/rms/team/roles'
    const editTeamApiUrl = 'session/api/v1/rms/team'
    const mutation = UseMutationCreateTeam(createTeamApiUrl)
    const editTeamMutation = UseMutationEditTeam(editTeamApiUrl)
    const {} = useQuery({
        queryKey: ['get-team-roles'],
        queryFn: () => getAllRoles(getAllRolesApiUrl),
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

    const handleQuerySuccess = (data: RolesApiResponseType) => {
        setInitialData((prevData) => ({
            ...prevData,
            roleCodes: data.data, // Update only roleCodes
        }))
    }

    const createTeam = (payload: createTeamPayload) => {
        // Call the mutation function to perform the patch
        mutation.mutate(payload, {
            onSuccess: () => {
                setRefetchAllTeamsQuery(true)
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }
    const editTeam = (payload: editTeamPayload) => {
        // Call the mutation function to perform the patch
        editTeamMutation.mutate(payload, {
            onSuccess: () => {
                setRefetchAllTeamsQuery(true)
            },
            onError: () => {
                // Handle error cases
            },
        })
    }

    const openDrawer = () => {
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }

    const createPayloadEditTeam = (data: DoActionParams) => {
        return {
            teamId: data.teamId ? data.teamId : '',
            teamName: data.values ? data.values.name : '',
            enable: data.enabled,
            roleCodes: Array.isArray(data.selectedRoles) ? data.selectedRoles.map((roles) => roles.code) : [],
        }
    }
    const doAction = (data: DoActionParams) => {
        closeDrawer()
        if (data.action && data.action.toUpperCase() === 'ADD') {
            if (data.values) {
                const payload = createPayload(data.values, data.selectedRoles)
                createTeam(payload)
            }
        } else if (data.action && data.action.toUpperCase() === 'UPDATE') {
            const payload = createPayloadEditTeam(data)
            editTeam(payload)
        }
    }

    const handleAddTeam = () => {
        openDrawer()
        setInitialData((prevInitialData) => {
            const updatedInitialData = { ...prevInitialData }
            updatedInitialData.name = ''
            updatedInitialData['selectedRoleCodes'] = []
            updatedInitialData.title = 'Add Team'
            updatedInitialData.mode = 'Add'
            return updatedInitialData
        })
    }

    const toolbar = () => {
        return (
            <Box>
                <Button onClick={handleAddTeam} size="xs" bgColor={'gray.200'}>
                    Add Team
                </Button>
            </Box>
        )
    }

    const deleteTeam = (data: TeamType) => {
        const payload = createDeletePayload(data)
        editTeam(payload)
    }

    const doActionAllTeam = (data: any) => {
        if (data.action === 'editTeam') {
            openDrawer()
            setInitialData((prevInitialData) => {
                const updatedInitialData = { ...prevInitialData }
                updatedInitialData.name = data.team?.teamName
                updatedInitialData.id = data.team?.teamId
                updatedInitialData.enabled = true
                updatedInitialData['selectedRoleCodes'] = data.team && data.team.roles ? [...data.team.roles] : []
                updatedInitialData.title = 'Edit Team'
                updatedInitialData.mode = 'Update'
                return updatedInitialData
            })
        } else if (data.action === 'deleteTeam') {
            deleteTeam(data.team)
        }
    }

    const refetchCompleted = () => {
        setRefetchAllTeamsQuery(false)
    }

    return (
        <PageCard toolbar={toolbar()} title={'Teams'} subtitle={`Configure Teams`} cardStyles={{ overflowY: 'auto' }}>
            <AllTeams
                doActionAllTeam={doActionAllTeam}
                refetchAllTeamsQuery={refetchAllTeamsQuery}
                refetchCompleted={refetchCompleted}
            ></AllTeams>

            {isDrawerOpen && <AddTeam initialData={initialData} doAction={doAction}></AddTeam>}
        </PageCard>
    )
}
