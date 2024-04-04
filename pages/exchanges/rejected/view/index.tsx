import { Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getRmsAccessMetadata } from 'apis/return/get'
import ExchangeViewLayout from 'layouts/ExchangeLayout/ExchangeViewLayout'
import { useRouter } from 'next/router'
import ExchangeDetailView from 'page-modules/exchange/components/ExchangeDetailView/ExchangeDetailView'
import { MASTER_ROLE, rmsAccessMetadataApiurl } from 'page-modules/exchange/config/config'
import { MasterRole, ReturnDetailTabStatus, toolbarButton } from 'page-modules/exchange/type/exchange'
import { useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'

export default function Details() {
    const [masterRole, setMasterRole] = useState<MasterRole>(MASTER_ROLE)
    const [actionType] = useState<string[]>([])
    const router = useRouter()
    const viewType: ReturnDetailTabStatus = Array.isArray(router.query.viewType)
        ? (router.query.viewType[0] as ReturnDetailTabStatus)
        : (router.query.viewType as ReturnDetailTabStatus) || 'details'

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
    // const doAction = (actionName: string) => {
    //     let actionType: string[] = []
    //     actionType = [...actionType, actionName]
    //     setActionType(actionType)
    // }
    const getToolbarButton = (viewType: ReturnDetailTabStatus) => {
        const toolbarButtons: toolbarButton[] = []
        if (viewType === 'details' && masterRole.code === 'ADMIN') {
            // toolbarButtons.push({
            //     doAction: doAction,
            //     title: 'Reject',
            //     actionName: 'reject',
            // })
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
        <ExchangeViewLayout toolbarButtons={getToolbarButton(viewType)}>
            <ExchangeDetailView
                parentTabStatus="CANCELLED"
                actionType={actionType}
                tabStatus={viewType}
                rmsType="EXCHANGE"
                setRefundStatus={setRefundStatus}
            ></ExchangeDetailView>
        </ExchangeViewLayout>
    )
}
