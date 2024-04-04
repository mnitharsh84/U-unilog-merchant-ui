import {
    ExchangeColumnRequestItem,
    ExchangeColumns,
    ExchangeItem,
    ExchangeRequest,
    ExchangeResponse,
} from './type/exchange'

export const isArrayOrObject = (value: any) => {
    if (Array.isArray(value)) {
        return 'array'
    } else if (typeof value === 'object') {
        return 'object'
    } else {
        return ''
    }
}

export function sanitiseData(apiResponse: ExchangeResponse | undefined): any[] {
    if (!apiResponse || !apiResponse.data) return []

    const { data } = apiResponse
    const returnOrderList: ExchangeColumns[] = []
    data.map((record) => {
        record.exchange_request.map((exchangeRequest: ExchangeRequest) => {
            const returnOrder: ExchangeColumns = {
                display_order_code: record.display_order_code,
                customer_email: record.customer_email,
                customer_phone: record.customer_phone,
                sale_order_code: record.sale_order_code,
                request_id: '',
                return_created_at: '',
                exchange_items: [],
                order_created_at: '',
                order_fulfillment_tat: '',
                shipping_option: '',
                reverse_pickup_code: '',
                oms_rvp_status: '',
                shipping_provider: [],
                replacement_sale_order_code: '',
            }
            returnOrder['request_id'] = exchangeRequest.request_id
            returnOrder['return_created_at'] = exchangeRequest.return_created_at
            returnOrder['order_created_at'] = exchangeRequest.order_created_at
            returnOrder['order_fulfillment_tat'] = exchangeRequest.order_fulfillment_tat
            returnOrder['shipping_option'] = exchangeRequest.shipping_option
            returnOrder['reverse_pickup_code'] = exchangeRequest.reverse_pickup_code
            returnOrder['oms_rvp_status'] = exchangeRequest.oms_rvp_status
            returnOrder['shipping_provider'] = getShippingProviderdata(exchangeRequest.shipping_provider)
            returnOrder['replacement_sale_order_code'] = exchangeRequest.replacement_sale_order_code

            exchangeRequest.exchange_items.map((requestItem: ExchangeItem) => {
                const item: ExchangeColumnRequestItem = {
                    sku_image: requestItem.sku_image,
                    quantity: requestItem.quantity,
                    product_display_name: requestItem.product_display_name,
                }
                // returnOrder['created_at'] = requestItem.created_at
                returnOrder['exchange_items'].push(item)
            })
            returnOrderList.push(returnOrder)
        })
    })
    return returnOrderList
}

const getShippingProviderdata = (shippingProvider: any) => {
    let shiipingProviderData: { [key: string]: string }[] = []
    if (shippingProvider && shippingProvider.shipmentTracking) {
        const awb = { 'Tracking Number': shippingProvider.shipmentTracking.trackingNumber }
        const shippingProviderCode = { 'Shipping Provider': shippingProvider.shipmentTracking.shippingProviderCode }
        shiipingProviderData = [awb, shippingProviderCode]
    } else {
        const awb = { 'Tracking Number': 'N/A' }
        const shippingProviderCode = { 'Shipping Provider': 'N/A' }
        shiipingProviderData = [awb, shippingProviderCode]
    }
    return shiipingProviderData
}
