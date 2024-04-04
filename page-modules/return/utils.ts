import {
    RequestItem,
    RetrunsColumns,
    ReturnColumnRequestItem,
    ReturnRequest,
    SellerReturnOrderResponse,
    ShippingData,
} from './type/return'

export const isArrayOrObject = (value: any) => {
    if (Array.isArray(value)) {
        return 'array'
    } else if (typeof value === 'object') {
        return 'object'
    } else {
        return ''
    }
}

export function sanitiseData(apiResponse: SellerReturnOrderResponse | null | undefined): RetrunsColumns[] {
    if (!apiResponse || !apiResponse.data) return []
    const { data } = apiResponse
    const returnOrderList: RetrunsColumns[] = []
    data.map((record) => {
        record.return_request.map((returnRequest: ReturnRequest) => {
            const returnOrder: RetrunsColumns = {
                display_order_code: record.display_order_code,
                customer_email: record.customer_email,
                customer_phone: record.customer_phone,
                sale_order_code: record.sale_order_code,
                request_id: '',
                created_at: '',
                request_items: [],
                order_created_at: '',
                order_fulfillment_tat: '',
                refund_mode: '',
                shipping_option: '',
                reverse_pickup_code: '',
                oms_rvp_status: '',
                refund_status: '',
                shipping_provider: [],
            }
            returnOrder['request_id'] = returnRequest.request_id
            returnOrder['created_at'] = returnRequest.return_created_at
            returnOrder['order_created_at'] = returnRequest.order_created_at
            returnOrder['order_fulfillment_tat'] = returnRequest.order_fulfillment_tat
            returnOrder['refund_mode'] = returnRequest.refund_mode
            returnOrder['shipping_option'] = returnRequest.shipping_option
            returnOrder['reverse_pickup_code'] = returnRequest.reverse_pickup_code
                ? returnRequest.reverse_pickup_code
                : ''
            returnOrder['oms_rvp_status'] = returnRequest.oms_rvp_status ? returnRequest.oms_rvp_status : ''
            returnOrder['refund_status'] = returnRequest.refund_status
            returnOrder['shipping_provider'] = getShippingProviderdata(returnRequest.shipping_provider)

            returnRequest.request_items.map((requestItem: RequestItem) => {
                const item: ReturnColumnRequestItem = {
                    sku_image: requestItem.sku_image,
                    quantity: requestItem.quantity,
                    product_display_name: requestItem.product_display_name,
                }
                // returnOrder['created_at'] = requestItem.created_at
                returnOrder['request_items'].push(item)
            })
            returnOrderList.push(returnOrder)
        })
    })
    return returnOrderList
}

const getShippingProviderdata = (shippingProvider: any): ShippingData[] => {
    const shiipingProviderData = [
        {
            key: 'trackingNumber',
            display: 'Tracking Number',
            value: shippingProvider?.shipmentTracking?.trackingNumber ?? 'N/A',
        },
        {
            key: 'shippingProviderCode',
            display: 'Shipping Provider',
            value: shippingProvider?.shipmentTracking?.shippingProviderCode ?? 'N/A',
        },
    ]
    return shiipingProviderData
}
