import {
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getSearchUser } from 'apis/get'
import SearchInput from 'page-modules/users/components/SearchInput/SearchInput'
import { SearchUserApiResponse, User } from 'page-modules/users/type/type'
import { DoActionAddUserParams } from 'page-modules/users/type/users'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'

type Props = {
    initialData: any
    doAction: (params: DoActionAddUserParams) => any
}

export default function AddUser({ initialData, doAction }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [userList, setUserList] = useState<Array<User>>([])
    let selectedUser: User
    const searchField = {
        key: 'name',
        display: 'Search User',
        initValue: '',
        placeHolder: 'Search user',
        required: true,
        showErrorMessage: true,
    }
    useEffect(() => {
        onOpen()
        return () => {
            onClose() // Ensure drawer is closed when component unmounts
        }
    }, [])

    const getSearchUserApiUrl = `session/api/v1/rms/team/user/search`
    const { isLoading, isError } = useQuery({
        queryKey: ['get-rms-teams'],
        queryFn: () => getSearchUser(getSearchUserApiUrl),
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
    const handleQuerySuccess = (data: SearchUserApiResponse) => {
        if (data && Array.isArray(data.data)) {
            setUserList(data.data)
        }
    }
    const closeDrawer = () => {
        onClose()
    }

    const handleCancel = () => {
        closeDrawer()
        doAction({ action: 'cancel' })
    }
    const selectUser = (user: User) => {
        selectedUser = user
    }
    const handleSubmit = () => {
        checkValidation(selectedUser)
        closeDrawer()
        doAction({ action: 'addUser', user: selectedUser })
    }
    const checkValidation = (selectedUser: User) => {
        if (!selectedUser.userId) {
            toast.error('Please select valid user')
            return false
        }
        return true
    }
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
        <Drawer isOpen={isOpen} onClose={handleCancel} placement="right" size="md">
            <DrawerOverlay />
            <DrawerContent fontSize={'xs'}>
                <DrawerHeader py={3} px={4} bg={`gray.100`} fontSize="md">
                    {initialData.title}
                </DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                    <Grid templateColumns={'repeat(1, 1fr)'} columnGap={'1rem'} mt={4}>
                        <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} mb={4}>
                            <Text
                                as={'span'}
                                fontSize={'x-small'}
                                color={'gray.500'}
                                textTransform={'capitalize'}
                                ps={3}
                                className="required-field"
                            >
                                {searchField.display}:
                            </Text>
                            <SearchInput
                                selectUser={selectUser}
                                userList={userList}
                                fieldKey={`user`}
                                field={searchField}
                            />
                        </Flex>
                    </Grid>

                    <Flex justify="flex-end" mt={4} w={`100%`} justifyContent="space-between" gap={4}>
                        <Button
                            bg={`white`}
                            variant={'outline'}
                            onClick={handleCancel}
                            size={'xs'}
                            h={`28px`}
                            w={`100%`}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            colorScheme={'teal'}
                            size={'xs'}
                            h={`28px`}
                            type={'submit'}
                            w={`100%`}
                        >
                            {initialData.mode}
                        </Button>
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}
