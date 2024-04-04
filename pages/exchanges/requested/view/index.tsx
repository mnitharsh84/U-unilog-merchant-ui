import { Center } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getRmsAccessMetadata } from 'apis/return/get'
import ExchangeViewLayout from 'layouts/ExchangeLayout/ExchangeViewLayout'
import { useRouter } from 'next/router'
import ExchangeDetailView from 'page-modules/exchange/components/ExchangeDetailView/ExchangeDetailView'
import { rmsAccessMetadataApiurl } from 'page-modules/exchange/config/config'
import {
    AccessMetaDataApiResponse,
    MasterRole,
    ReturnDetailTabStatus,
    toolbarButton,
} from 'page-modules/exchange/type/exchange'
import { useState } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'

export default function Details() {
    const [masterRole, setMasterRole] = useState<MasterRole[]>([])
    const [actionType, setActionType] = useState<string[]>([])

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
    const handleQuerySuccess = (data: AccessMetaDataApiResponse) => {
        if (data && data.data && Array.isArray(data.data)) {
            const roles = data.data.map((role) => role.master_role).flat()
            setMasterRole(roles)
        }
    }
    const doAction = (actionName: string) => {
        let actionType: string[] = []
        actionType = [...actionType, actionName]
        setActionType(actionType)
    }
    const getToolbarButton = (viewType: ReturnDetailTabStatus) => {
        const toolbarButtons: toolbarButton[] = []
        if (
            viewType === 'details' &&
            (masterRole.some((role) => role.code === 'ADMIN') ||
                masterRole.some((role) => role.code === 'APPROVAL_EXCHANGES'))
        ) {
            toolbarButtons.push(
                {
                    doAction: doAction,
                    title: 'Reject',
                    actionName: 'reject',
                },
                {
                    doAction: doAction,
                    title: 'Approve',
                    actionName: 'approve',
                    colorScheme: 'teal',
                },
            )
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
                parentTabStatus="ACTION_REQUIRED"
                actionType={actionType}
                tabStatus={viewType}
                rmsType="EXCHANGE"
                setRefundStatus={setRefundStatus}
            ></ExchangeDetailView>
        </ExchangeViewLayout>
    )
}
