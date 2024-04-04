import { Box, Card, Center, Flex, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getReturnOrder } from 'apis/return/get'
import { CONVERT_EXCHANGE } from 'apis/url'
import { useRouter } from 'next/router'
import ApproveRequest from 'page-modules/return/components/ApproveRequest/ApproveRequest'
import { ReturnActions, URL_MAPPING_WITH_TABSTATUS } from 'page-modules/return/config/config'
import {
    UseMutationReturnOrderAction,
    useMutationChangeStateAction,
    useMutationConvertChange,
    useMutationMarkRefundComplete,
} from 'page-modules/return/hooks/mutations'
import {
    ChangeStateApiPayload,
    CompleteRefundPayload,
    ConvertExchangePayload,
    CustomerDetail,
    ProductDetail,
    RMSTYPE,
    RequestItem,
    Return,
    ReturnDetailTabStatus,
    ReturnRequest,
    SaleOrderApprovalRequest,
    completeRefundItem,
} from 'page-modules/return/type/return'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Activity from 'shared/components/Activity/Activity'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import { dayDiffenceFromCurrentDate } from 'shared/utils/functions'

import ConvertToExchange from '../ConvertToExchange/ConvertToExchange'
import Details from '../Details/Details'

type Props = {
    tabStatus: ReturnDetailTabStatus
    rmsType: RMSTYPE
    actionType: ReturnActions[]
    parentTabStatus: string
    returnMergeEnable?: boolean
    setRefundStatus?: (refundStatus: string) => void
}

const returnOrderAction = 'session/api/v1/rms/seller/return-order/action'
const chnageStateApiUrl = 'session/api/v1/rms/seller/return-order/change-state'
const markRefundComplete = 'session/api/v1/rms/seller/return-order/mark-refund-complete'

export default function ReturnsDetailView({
    tabStatus,
    rmsType,
    actionType,
    parentTabStatus,
    returnMergeEnable,
    setRefundStatus,
}: Props) {
    const router = useRouter()
    const [openedDrawerName, setOpenedDrawerName] = useState<string>('')

    const orderId = router.query.orderId
    const requestId: string | undefined = Array.isArray(router.query.requestId)
        ? router.query.requestId[0]
        : router.query.requestId
    const returnorderApiUrl = `session/api/v1/rms/seller/return-order/data-sale-order?sale_order_code=${orderId}&rms_type=${rmsType}&rms_page=${parentTabStatus}`
    const [returnData, setReturnData] = useState<{
        returns: Return[]
        customer: CustomerDetail | Record<string, never>
    }>({
        returns: [],
        customer: {},
    })
    const mutation = UseMutationReturnOrderAction(returnOrderAction)
    const changeStateMutation = useMutationChangeStateAction(chnageStateApiUrl)
    const completeRefundMutation = useMutationMarkRefundComplete(markRefundComplete)
    const convertReturnToExchangeMutation = useMutationConvertChange(CONVERT_EXCHANGE)
    useEffect(() => {
        if (actionType && actionType[0]) {
            openDrawer(actionType[0])
        }
    }, [actionType])

    const { isLoading, isError } = useQuery({
        queryKey: ['get-return-order'],
        queryFn: () => getReturnOrder(returnorderApiUrl),
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

    const handleQuerySuccess = (data: any) => {
        const products: any[] = []
        let customer: CustomerDetail = { pickupAddress: {} }
        const saleOrderCode = data.sale_order_code
        const paymentMode = data.payment_mode
        if (data.return_request) {
            data.return_request.map((returnRequest: ReturnRequest) => {
                const requestIdd = returnRequest.request_id
                const orderFullfilledAt = returnRequest.order_fulfillment_tat
                const shippingOption = returnRequest.shipping_option
                returnRequest.request_items.map((item: RequestItem) => {
                    const product: ProductDetail = {
                        item_id: item.item_id,
                        bundleSkuCode: item.bundle_sku_code,
                        bundle_identifier: returnRequest.bundle_identifier,
                        fullfilmentData: orderFullfilledAt,
                        created_at: item.created_at,
                        requestedDaysBefore: dayDiffenceFromCurrentDate(item.created_at),
                        skuImage: item.sku_image,
                        name: item.product_display_name,
                        sellerSkuCode: item.seller_sku_code,
                        skuCode: item.sku_code,
                        price: parseFloat(item.sell_price_all_inclusive),
                        taxDescription: 'Price incl. of discount & taxes',
                        quantity: item.quantity,
                        totalPrice: parseFloat(item.sell_price_all_inclusive) * item.quantity,
                        reasonText: item.reason_text,
                        requestId: requestIdd,
                        saleOrderCode: saleOrderCode,
                        shippingOption: shippingOption,
                        mediaURLs: returnRequest.bundle_identifier ? returnRequest.bundle_image_urls : item.image_urls,
                        refundMode: returnRequest.refund_mode,
                        beneficiaryDetails: returnRequest.beneficiary_details,
                        seller_approved_quantity: item.seller_approved_quantity,
                        approved_quantity: item.approved_quantity,
                        refundStatus: returnRequest.refund_status,
                        buyer_reason_text: item.buyer_reason_text,
                        paymentMode: paymentMode,
                    }
                    products.push(product)
                })
                if (returnRequest.request_id === requestId) {
                    customer = {
                        pickupAddress: returnRequest.pickup_address,
                    }
                    if (setRefundStatus) setRefundStatus(returnRequest.refund_status)
                }
            })

            const groupProductItemByRequestId = products.reduce<Record<string, Return>>(
                (result, item: ProductDetail) => {
                    if (!result[item.requestId]) {
                        result[item.requestId] = {
                            paymentMode: item.paymentMode,
                            refundMode: item.refundMode,
                            beneficiaryDetails: item.beneficiaryDetails,
                            items: [],
                            requestId: item.requestId,
                            refundStatus: item.refundStatus,
                        }
                    }
                    result[item.requestId].items.push(item)
                    return result
                },
                {},
            )
            const groupedItemsArray = Object.values(groupProductItemByRequestId)
            setReturnData({ returns: groupedItemsArray, customer: customer })
        }
    }

    const openDrawer = (currentAction: string) => {
        setOpenedDrawerName(currentAction)
    }

    const closeDrawer = () => {
        setOpenedDrawerName('')
    }
    const doAction = (data: any) => {
        closeDrawer()
        if (data.action === ReturnActions.approve) {
            const saleOrderCode = Array.isArray(orderId) ? orderId[0] : orderId
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: saleOrderCode || '',
                action: 'APPROVE',
                requestItemIdToQuantity: data.itemQuantity,
                sellerRemark: data.remark,
            }
            // console.log(payload)
            approveReturnOrder(payload)
        } else if (data.action === ReturnActions.manualApprove) {
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: Array.isArray(orderId) ? orderId[0] : orderId,
                action: 'APPROVE',
                requestItemIdToQuantity: data.itemQuantity,
                sellerRemark: data.remark,
            }
            approveReturnOrder({ ...payload, ...data.manualApprovalData })
        } else if (data.action === ReturnActions.reject) {
            const saleOrderCode = Array.isArray(orderId) ? orderId[0] : orderId
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: saleOrderCode || '',
                action: 'CANCEL',
                sellerRemark: data.remark,
            }
            approveReturnOrder(payload)
        } else if (data.action === ReturnActions.backToRequested) {
            const saleOrderCode = Array.isArray(orderId) ? orderId[0] : orderId
            const payload: ChangeStateApiPayload = {
                requestIds: data.requestedIds,
                saleOrderCode: saleOrderCode || '',
                from: parentTabStatus,
                to: 'CREATED',
                rmsType: 'RETURN',
            }
            changeReturnRequsetState(payload)
        } else if (data.action === ReturnActions.completeRefund) {
            const payload: CompleteRefundPayload = {} as CompleteRefundPayload
            const items: completeRefundItem[] = []
            for (const requestId in data.refundData) {
                const item: completeRefundItem = {
                    returnId: requestId,
                    amount: parseInt(data.refundData[requestId].approvedAmount),
                }
                items.push(item)
            }
            payload.items = items

            completeRefund(payload)
        } else if (data.action === 'discard') {
            const saleOrderCode = Array.isArray(orderId) ? orderId[0] : orderId
            const payload: ChangeStateApiPayload = {
                requestIds: data.requestedIds,
                saleOrderCode: saleOrderCode || '',
                from: 'CREATED',
                to: 'DISCARDED',
                rmsType: 'RETURN',
            }
            deleteReturnRequest(payload)
        } else if (data.action === ReturnActions.convertToExchange) {
            convertToChange(data.payload)
        }
    }
    const approveReturnOrder = (payload: SaleOrderApprovalRequest) => {
        mutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.data && data.data.successful) {
                    const customeMsg =
                        payload.action === 'APPROVE'
                            ? data.data.id.length > 1
                                ? 'Return requests have been successfully merged and approved.'
                                : 'Return request has been approved successfully.'
                            : data.data.id.length > 1
                            ? 'Return requests have been rejected.'
                            : 'Return request has been rejected.'
                    // const message = data.data.message ? data.data.message : customeMsg
                    toast.success(customeMsg)
                    const redirectUrl = URL_MAPPING_WITH_TABSTATUS[parentTabStatus]
                    router.push(redirectUrl)
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }
    const deleteReturnRequest = (payload: ChangeStateApiPayload) => {
        changeStateMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    const customeMsg = `Return ${
                        payload.requestIds.length > 1 ? 'requests have' : 'request has'
                    } been moved to trash.`
                    toast.success(customeMsg)
                    const redirectUrl = URL_MAPPING_WITH_TABSTATUS[parentTabStatus]
                    router.push(redirectUrl)
                }
            },
        })
    }
    const changeReturnRequsetState = (payload: ChangeStateApiPayload) => {
        changeStateMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    const customeMsg = 'Return request state changed successfully!'
                    const message = data.message ? data.message : customeMsg
                    toast.success(message)
                    const redirectUrl = URL_MAPPING_WITH_TABSTATUS[parentTabStatus]
                    router.push(redirectUrl)
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }

    const completeRefund = (payload: CompleteRefundPayload) => {
        completeRefundMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && Array.isArray(data)) {
                    let markedCompleteCount = 0
                    const total = data.length
                    for (const request of data) {
                        if (request.refundStatus.toUpperCase() === 'COMPLETED') {
                            markedCompleteCount++
                        }
                    }
                    const message = `Refund processing has been successfully completed for ${markedCompleteCount} out of ${total} return ${
                        total > 1 ? 'requests' : 'request'
                    }.`
                    toast.success(message)
                    const redirectUrl = URL_MAPPING_WITH_TABSTATUS[parentTabStatus]
                    router.push(redirectUrl)
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }

    const convertToChange = (payload: ConvertExchangePayload) => {
        convertReturnToExchangeMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    toast.success('Return request has been successfully converted to exchange')
                    const redirectUrl = URL_MAPPING_WITH_TABSTATUS[parentTabStatus]
                    router.push(redirectUrl)
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }

    if (isLoading)
        return (
            <Flex h="100%" gap="4" direction={{ base: 'column', md: 'row' }}>
                <Box mt={4} width={{ base: '100%', md: '75%' }}>
                    <Card p={4}>
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton p={4} height="20px" width="100%" />
                    </Card>
                </Box>
                <Box mt={4} width={{ base: '100%', md: '25%' }}>
                    <Card p={4}>
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                    </Card>
                </Box>
            </Flex>
        )

    if (isError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )
    return (
        <div>
            {tabStatus === 'details' && (
                <Details
                    returns={returnData.returns}
                    customer={returnData.customer}
                    parentTabStatus={parentTabStatus}
                    requestId={requestId}
                />
            )}
            {tabStatus === 'activity' && <Activity />}
            {openedDrawerName && openedDrawerName !== ReturnActions.convertToExchange ? (
                <ApproveRequest
                    returns={
                        returnMergeEnable && actionType[0] !== 'manualApprove' && actionType[0] !== 'completeRefund'
                            ? returnData.returns
                            : returnData.returns.filter((returnObj) => returnObj.requestId === requestId)
                    }
                    actionType={actionType}
                    doAction={doAction}
                    returnMergeEnable={returnMergeEnable}
                ></ApproveRequest>
            ) : openedDrawerName && openedDrawerName === ReturnActions.convertToExchange ? (
                <ConvertToExchange
                    returns={returnData.returns.filter((returnObj) => returnObj.requestId === requestId)}
                    requestId={requestId ? requestId : ''}
                    actionType={actionType}
                    doAction={doAction}
                ></ConvertToExchange>
            ) : null}
        </div>
    )
}
