import { Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getRmsAccessMetadata } from 'apis/return/get'
import ReturnsViewLayout from 'layouts/ReturnsLayout/ReturnViewLayout'
import { useRouter } from 'next/router'
import ReturnsDetailView from 'page-modules/return/components/ReturnDetailView/ReturnDetailView'
import { MASTER_ROLE, ReturnActions, rmsAccessMetadataApiurl } from 'page-modules/return/config/config'
import { MasterRole, REFUND_MODE, ReturnDetailTabStatus, toolbarButton } from 'page-modules/return/type/return'
import { useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'

export default function Details() {
    const [masterRole, setMasterRole] = useState<MasterRole>(MASTER_ROLE)
    const [actionType, setActionType] = useState<ReturnActions[]>([])

    const router = useRouter()
    const viewType: ReturnDetailTabStatus = Array.isArray(router.query.viewType)
        ? (router.query.viewType[0] as ReturnDetailTabStatus)
        : (router.query.viewType as ReturnDetailTabStatus) || 'details'
    const refundStatus: string = Array.isArray(router.query.refundStatus)
        ? (router.query.refundStatus[0] as REFUND_MODE)
        : (router.query.refundStatus as REFUND_MODE) || ''

    const { isLoading, isError } = useQuery({
        queryKey: ['get-rms-access-metadata'],
        queryFn: () => getRmsAccessMetadata(rmsAccessMetadataApiurl),
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
    const handleQuerySuccess = (data: any) => {
        if (data && data.data && Array.isArray(data.data)) {
            const masterRole = data.data[0].master_role
            setMasterRole(masterRole)
        }
    }
    const doAction = (actionName: ReturnActions) => {
        setActionType([actionName])
    }
    const getToolbarButton = (viewType: ReturnDetailTabStatus) => {
        const toolbarButtons: toolbarButton[] = []
        if (viewType === 'details' && (masterRole.code === 'ADMIN' || masterRole.code === 'APPROVAL_RETURNS')) {
            // toolbarButtons.push({
            //     doAction: doAction,
            //     title: 'Reject',
            //     actionName: 'reject',
            // })
            if (masterRole.code === 'ADMIN' && refundStatus === 'INELIGIBLE') {
                toolbarButtons.push({
                    doAction: doAction,
                    title: 'Complete Refund',
                    actionName: 'completeRefund',
                })
            }
        }
        return toolbarButtons
    }
    const setRefundStatus = (refundStatus: string) => {
        console.log(refundStatus)
    }
    if (isLoading) return

    if (isError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )
    return (
        <ReturnsViewLayout toolbarButtons={getToolbarButton(viewType)}>
            <ReturnsDetailView
                parentTabStatus="APPROVED"
                actionType={actionType}
                tabStatus={viewType}
                rmsType="RETURN"
                setRefundStatus={setRefundStatus}
            ></ReturnsDetailView>
        </ReturnsViewLayout>
    )
}
