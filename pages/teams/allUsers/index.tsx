import { Box, Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import AddEditUser from 'page-modules/users/components/AddEditUser/AddEditUser'
import AddUser from 'page-modules/users/components/AddUser/AddUser'
import AllUsers from 'page-modules/users/components/AllUsers/AllUser'
import { createUserFormFields, editUserFormField } from 'page-modules/users/config/users'
// import { useAuthProvider } from "shared/providers/AuthProvider";
import {
    UseMutationAssociateUserToTeam,
    UseMutationCreateUser,
    UseMutationEditUser,
} from 'page-modules/users/hooks/mutations'
import {
    AssociateUserToTeamPayload,
    CreateUserPayload,
    DoActionAllUserType,
    EditUserPayload,
    User,
} from 'page-modules/users/type/type'
import { DoActionAddUserParams, DoActionParams, formData } from 'page-modules/users/type/users'
import { setEditUserFormFieldsInitalData, setInitialValueForCreateUserFields } from 'page-modules/users/utils/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'
import PageCard from 'shared/components/PageCard/PageCard'
import { formField } from 'shared/types/forms'

type intialDataType = {
    title: string
    mode: string
    formFields: formField[]
    userId: string
}

const createDeletePayload = (data: User, teamId: string) => {
    return {
        userId: data.userId,
        teamId: teamId,
        firstName: data.firstName,
        lastName: data.lastName,
        enable: false,
    }
}
export default function Users() {
    const router = useRouter()
    const teamId = Array.isArray(router.query?.teamId) ? router.query?.teamId[0] : router.query?.teamId

    const teamName = Array.isArray(router.query?.teamName) ? router.query?.teamName[0] : router.query?.teamName

    const [initialData, setInitialData] = useState<intialDataType>({
        title: '', // Provide default values for each property
        mode: '',
        formFields: [],
        userId: '',
    })

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [refetchAllTeamsQuery, setRefetchAllTeamsQuery] = useState<boolean>(false)
    const [isAddUserDrawerOpen, setIsAddUserDrawerOpen] = useState<boolean>(false)

    // const { tenantName } = useAuthProvider()
    const createUserApiUrl = 'session/api/v1/rms/team/user/create'
    const editUserApiUrl = 'session/api/v1/rms/team/user'

    const mutation = UseMutationCreateUser(createUserApiUrl)
    const editUserMutation = UseMutationEditUser(editUserApiUrl)

    const AssociateUserToTeamApiUrl = 'session/api/v1/rms/team/user'
    const associateUserToTeamMutation = UseMutationAssociateUserToTeam(AssociateUserToTeamApiUrl)

    const associateUserToTeam = (payload: AssociateUserToTeamPayload) => {
        associateUserToTeamMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.data && data.data.successful) {
                    toast.success(data.data.message)
                    setRefetchAllTeamsQuery(true)
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }
    const createUser = (payload: CreateUserPayload) => {
        mutation.mutate(payload, {
            onSuccess: (data) => {
                toast.success(data.data.message)
                if (data && data.data && data.data.successful) {
                    if (teamId) {
                        const payloadAssociateUserToTeam = {
                            userId: data.data.id,
                            teamId: teamId,
                            enable: true,
                        }
                        associateUserToTeam(payloadAssociateUserToTeam)
                    }
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }

    const editUser = (payload: EditUserPayload) => {
        editUserMutation.mutate(payload, {
            onSuccess: (data) => {
                toast.success(data.data.message)
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

    const createPayloadEditUser = (data: any) => {
        return {
            teamId: teamId,
            userId: data.userId,
            ...data.values,
        }
    }
    const createPayloadAddUser = (formData: formData) => {
        const { emailId, password, username, firstName, lastName } = formData
        // Create the payload
        const payload: CreateUserPayload = {
            emailId,
            password,
            username,
            firstName,
            lastName,
            // Add other properties as needed
        }

        return payload
    }
    const doAction = (data: DoActionParams) => {
        closeDrawer()
        if (data.action && data.action.toUpperCase() === 'CREATE') {
            if (data.values && 'emailId' in data.values && 'password' in data.values) {
                const payload = createPayloadAddUser(data.values)
                createUser(payload)
            } else {
                // Handle missing required properties for ADD action
                console.error('Missing required properties for ADD action')
            }
        } else if (data.action && data.action.toUpperCase() === 'UPDATE') {
            const payload = createPayloadEditUser(data)
            editUser(payload)
        }
    }

    const handleCreateNewUser = () => {
        openDrawer()
        setInitialData((prevInitialData) => {
            const updatedInitialData = { ...prevInitialData }
            updatedInitialData.title = 'Create New User'
            updatedInitialData.mode = 'Create'
            updatedInitialData.formFields = setInitialValueForCreateUserFields(createUserFormFields)
            updatedInitialData.userId = ''
            return updatedInitialData
        })
    }

    const handleAddUser = () => {
        setIsAddUserDrawerOpen(true)
        setInitialData((prevInitialData) => {
            const updatedInitialData = { ...prevInitialData }
            updatedInitialData.title = 'Add Existing User'
            updatedInitialData.mode = 'Add'
            updatedInitialData.userId = ''
            return updatedInitialData
        })
    }

    const doActionAddUser = (data: DoActionAddUserParams) => {
        setIsAddUserDrawerOpen(false)
        if (data.action && data.action.toUpperCase() === 'ADDUSER') {
            if (teamId && data.user) {
                const payloadAssociateUserToTeam = {
                    userId: data.user.userId,
                    teamId: teamId,
                    enable: true,
                }
                associateUserToTeam(payloadAssociateUserToTeam)
            }
        }
    }

    const deleteUser = (data: User) => {
        if (teamId) {
            const payload = createDeletePayload(data, teamId)
            editUser(payload)
        }
    }

    const doActionAllUser = (data: DoActionAllUserType) => {
        if (data.action === 'editUser') {
            openDrawer()
            setInitialData((prevInitialData) => {
                const updatedInitialData = { ...prevInitialData }
                updatedInitialData.title = 'Edit User'
                updatedInitialData.mode = 'Update'
                updatedInitialData.userId = data.user.userId
                updatedInitialData.formFields = editUserFormField
                setEditUserFormFieldsInitalData(data.user, updatedInitialData.formFields)
                return updatedInitialData
            })
        } else if (data.action === 'deleteUser') {
            deleteUser(data.user)
        }
    }

    const refetchCompleted = () => {
        setRefetchAllTeamsQuery(false)
    }

    const toolbar = () => {
        return (
            <Box>
                <Button m={2} onClick={handleCreateNewUser} size="xs" bgColor={'gray.200'}>
                    Create New User
                </Button>
                <Button m={2} onClick={handleAddUser} size="xs" bgColor={'gray.200'}>
                    Add Existing User
                </Button>
            </Box>
        )
    }

    return (
        <PageCard
            toolbar={toolbar()}
            title={'Users '}
            subtitle={`Configure Users for team (${teamName})`}
            cardStyles={{ overflowY: 'auto' }}
        >
            {teamId ? (
                <AllUsers
                    doActionAllUser={doActionAllUser}
                    teamId={teamId}
                    refetchAllTeamsQuery={refetchAllTeamsQuery}
                    refetchCompleted={refetchCompleted}
                ></AllUsers>
            ) : (
                'No Record Found'
            )}
            {isDrawerOpen && <AddEditUser initialData={initialData} doAction={doAction}></AddEditUser>}
            {isAddUserDrawerOpen && <AddUser initialData={initialData} doAction={doActionAddUser}></AddUser>}
        </PageCard>
    )
}
