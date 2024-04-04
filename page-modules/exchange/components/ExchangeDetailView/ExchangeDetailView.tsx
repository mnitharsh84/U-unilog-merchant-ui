import { Box, Card, Center, Flex, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getExchangeOrder } from 'apis/exchange/get'
import { useRouter } from 'next/router'
import { URL_MAPPING_WITH_TABSTATUS } from 'page-modules/exchange/config/config'
import { UseMutationReturnOrderAction, useMutationChangeStateAction } from 'page-modules/exchange/hooks/mutations'
import { CustomerDetail, RMSTYPE, ReturnDetailTabStatus } from 'page-modules/exchange/type/exchange'
import {
    Exchange,
    ExchangeData,
    ExchangeItem,
    ExchangeRequest,
    ProductDetail,
} from 'page-modules/exchange/type/exchange'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Activity from 'shared/components/Activity/Activity'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import { dayDiffenceFromCurrentDate } from 'shared/utils/functions'

import ApproveRequest from '../ApproveRequest/ApproveRequest'
import Details from '../Details/Details'

type Props = {
    tabStatus: ReturnDetailTabStatus
    rmsType: RMSTYPE
    actionType: string[]
    parentTabStatus: string
    returnMergeEnable?: boolean
    setRefundStatus?: (refundStatus: string) => void
}

const exchangeOrderAction = 'session/api/v1/rms/seller/exchange-order/action'
const chnageStateApiUrl = 'session/api/v1/rms/seller/exchange-order/change-state'

export default function ExchangeDetailView({ tabStatus, actionType, parentTabStatus, returnMergeEnable }: Props) {
    const router = useRouter()
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false)

    const orderId: string | undefined = Array.isArray(router.query.orderId)
        ? router.query.orderId[0]
        : router.query.orderId
    const requestId: string | undefined = Array.isArray(router.query.requestId)
        ? router.query.requestId[0]
        : router.query.requestId
    const exchangeOrderApiUrl = `session/api/v1/rms/seller/exchange-order/data-sale-order?sale_order_code=${orderId}&rms_page=${parentTabStatus}`
    const [returnData, setReturnData] = useState<{
        returns: Exchange[]
        customer: CustomerDetail | Record<string, never>
    }>({
        returns: [],
        customer: {},
    })
    const mutation = UseMutationReturnOrderAction(exchangeOrderAction)
    const changeStateMutation = useMutationChangeStateAction(chnageStateApiUrl)
    useEffect(() => {
        if (actionType && actionType[0]) {
            openDrawer()
        }
    }, [actionType])

    const { isLoading, isError } = useQuery({
        queryKey: ['get-exchange-order'],
        queryFn: () => getExchangeOrder(exchangeOrderApiUrl),
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

    const handleQuerySuccess = (data: ExchangeData) => {
        console.log(data)
        const products: any[] = []
        let customer: CustomerDetail = { pickupAddress: {} }
        const saleOrderCode = data.sale_order_code
        if (data.exchange_request) {
            data.exchange_request.map((returnRequest: ExchangeRequest) => {
                const requestIdd = returnRequest.request_id
                const orderFullfilledAt = returnRequest.order_fulfillment_tat
                const shippingOption = returnRequest.shipping_option
                returnRequest.exchange_items.map((item: ExchangeItem) => {
                    const product: ProductDetail = {
                        item_id: item.item_id,
                        fullfilmentData: orderFullfilledAt,
                        created_at: item.created_at,
                        requestedDaysBefore: dayDiffenceFromCurrentDate(item.created_at),
                        skuImage: item.sku_image,
                        name: item.product_display_name,
                        sellerSkuCode: item.seller_sku_code,
                        skuCode: item.sku_code,
                        price: parseFloat(String(item.sell_price_all_inclusive)),
                        taxDescription: 'Price incl. of discount & taxes',
                        quantity: item.quantity,
                        totalPrice: parseFloat(String(item.sell_price_all_inclusive)) * item.quantity,
                        reasonText: item.reason_text,
                        requestId: requestIdd,
                        saleOrderCode: saleOrderCode,
                        shippingOption: shippingOption,
                        mediaURLs: returnRequest.bundle_identifier ? returnRequest.bundle_image_urls : item.image_urls,
                        seller_approved_quantity: item.seller_approved_quantity,
                        approved_quantity: item.approved_quantity,
                        seller_remark: returnRequest.seller_remark,
                        buyer_reason_text: item.buyer_reason_text,
                    }
                    products.push(product)
                })
                if (returnRequest.request_id === requestId) {
                    customer = {
                        pickupAddress: returnRequest.pickup_address,
                    }
                }
            })

            const groupProductItemByRequestId = products.reduce<Record<string, Exchange>>(
                (result, item: ProductDetail) => {
                    if (!result[item.requestId]) {
                        result[item.requestId] = {
                            items: [],
                            requestId: item.requestId,
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

    const openDrawer = () => {
        setIsDrawerOpen(true)
    }

    const closeDrawer = () => {
        setIsDrawerOpen(false)
    }
    const doAction = (data: any) => {
        closeDrawer()
        if (data.action === 'approve') {
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: Array.isArray(orderId) ? orderId[0] : orderId,
                action: 'APPROVE',
                requestItemIdToQuantity: data.itemQuantity,
                sellerRemark: data.remark,
                reversePickUpAction: data.reversePickUpAction,
            }
            // console.log(payload)
            approveReturnOrder(payload)
        } else if (data.action === 'reject') {
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: Array.isArray(orderId) ? orderId[0] : orderId,
                action: 'CANCEL',
                sellerRemark: data.remark,
            }
            approveReturnOrder(payload)
        } else if (data.action === 'backToRequested') {
            const payload = {
                requestIds: data.requestedIds,
                saleOrderCode: Array.isArray(orderId) ? orderId[0] : orderId,
                from: parentTabStatus,
                to: 'CREATED',
                rmsType: 'RETURN',
            }
            changeReturnRequsetState(payload)
        }
    }
    const approveReturnOrder = (payload: any) => {
        mutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.data && data.data.successful) {
                    const customeMsg =
                        payload.action === 'APPROVE'
                            ? 'Exchange request approved successfully!'
                            : 'Exchange request rejected successfully!'
                    const message = data.data.message ? data.data.message : customeMsg
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

    const changeReturnRequsetState = (payload: any) => {
        changeStateMutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    const customeMsg = 'Exchange request state changed successfully!'
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
            {isDrawerOpen && (
                <ApproveRequest
                    returns={
                        returnMergeEnable
                            ? returnData.returns
                            : returnData.returns.filter((returnObj) => returnObj.requestId === requestId)
                    }
                    actionType={actionType}
                    doAction={doAction}
                ></ApproveRequest>
            )}
        </div>
    )
}
