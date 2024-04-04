import { Flex } from '@chakra-ui/react'
import { Box, Button } from '@chakra-ui/react'
import AllReasons from 'page-modules/return/components/AllReasons/AllReasons'
import ConfigureReasons from 'page-modules/return/components/ConfigureReasons/ConfigureReasons'
import SelectReturnType from 'page-modules/return/components/ReturnType/ReturnType'
import { useState } from 'react'
import CustomAlertDialog from 'shared/components/CustomAlertDialog/CustomAlertDialog'
import PageCard from 'shared/components/PageCard/PageCard'
import * as Yup from 'yup'

const formFields = [
    {
        key: 'rms_type',
        type: 'select',
        placeHolder: 'Select Reason Type',
        display: '',
        initValue: '',
        validation: Yup.string().required('This field is required'),
        editable: true,
        required: true,
        options: [
            {
                key: 'RETURN',
                display: 'Return',
                hidden: false,
            },
            {
                key: 'EXCHANGE',
                display: 'Exchange',
                hidden: false,
            },
        ],
    },
]
export default function Reasons() {
    let reasonType = ''
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)
    const [isConfirmationOpen, setIsConfirmationOpen] = useState<boolean>(false)

    const [refetchAllReasonsQuery, setRefetchAllReasonsQuery] = useState<boolean>(false)
    const [initialData, setInitialData] = useState({
        title: '', // Provide default values for each property
        mode: '',
        serverData: {},
        id: '',
    })
    const [isFormValid, setIsFormValid] = useState(false)
    const handleFormValuesChange = (isFormValid: boolean, values: any) => {
        reasonType = values['rms_type']
        setIsFormValid(isFormValid)
    }
    const doActionReasons = (data: any) => {
        if (data.action === 'editReason') {
            console.log(data.reason)
            openDrawer()
            setInitialData((prevInitialData) => {
                const updatedInitialData = { ...prevInitialData }
                updatedInitialData.title = 'Edit Reason'
                updatedInitialData.mode = 'Update'
                updatedInitialData.id = data.reason?.id
                updatedInitialData.serverData = data.reason
                return updatedInitialData
            })
        } else if (data.action === 'deleteReason') {
            // deleteUser(data.user);
        }
    }
    const openDrawer = () => {
        setIsDrawerOpen(true)
    }
    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }

    const doAction = (data: any) => {
        closeDrawer()
        if (data.action && data.action.toUpperCase() === 'CREATE') {
            setRefetchAllReasonsQuery(true)
        } else if (data.action && data.action.toUpperCase() === 'UPDATE') {
            setRefetchAllReasonsQuery(true)
        }
    }
    const handleAddReason = () => {
        setIsConfirmationOpen(true)
    }
    const handleCloseConfirmation = () => {
        setIsConfirmationOpen(false)
    }
    const handleConfirmClick = () => {
        setIsConfirmationOpen(false)
        openDrawer()
        setInitialData((prevInitialData) => {
            const updatedInitialData = { ...prevInitialData }
            updatedInitialData.title = `Add Reason`
            updatedInitialData.mode = 'Create'
            updatedInitialData.serverData = { rms_type: reasonType }
            updatedInitialData.id = ''
            return updatedInitialData
        })
    }
    const refetchCompleted = () => {
        setRefetchAllReasonsQuery(false)
    }
    const toolbar = () => {
        return (
            <Box>
                <Button m={2} onClick={handleAddReason} size="xs" bgColor={'gray.200'}>
                    Add Reason
                </Button>
            </Box>
        )
    }
    return (
        <PageCard
            toolbar={toolbar()}
            title={'Return & Exchange Reasons'}
            subtitle={`All Reasons`}
            cardStyles={{ overflowY: 'auto' }}
        >
            <Flex flexDir="column">
                {isDrawerOpen && (
                    <ConfigureReasons initialReasonData={initialData} doAction={doAction}></ConfigureReasons>
                )}
                <AllReasons
                    doActionReasons={doActionReasons}
                    refetchAllReasonsQuery={refetchAllReasonsQuery}
                    refetchCompleted={refetchCompleted}
                ></AllReasons>
                <CustomAlertDialog
                    isOpen={isConfirmationOpen}
                    onClose={handleCloseConfirmation}
                    onConfirm={handleConfirmClick}
                    title="Select Reason Type"
                    body={
                        <SelectReturnType
                            initialValues={{ rms_type: '' }}
                            formFields={formFields}
                            onInputChange={handleFormValuesChange}
                        />
                    }
                    cancelText="Cancel"
                    confirmText="Confirm"
                    isValid={isFormValid}
                />
            </Flex>
        </PageCard>
    )
}
