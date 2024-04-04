import { parseDate } from 'shared/utils/functions'

import { BuyerColumns, BuyerRequestData, BuyerRequestResponse, BuyerTabStatus } from './types/buyer'

export function sanitiseData(apiResponse: BuyerRequestResponse | undefined, tabStatus: BuyerTabStatus): any[] {
    if (!apiResponse || !apiResponse.data) return []

    const { data } = apiResponse
    const returnOrderList: BuyerColumns[] = []
    if (tabStatus === 'REATTEMPT') {
        data.map((record: BuyerRequestData) => {
            const buyerRequest: BuyerColumns = {
                id: record.id,
                status: record.status,
                subRemark: record.reattemptDetails.sub_remark,
                ShipmentDetails: {
                    id: record.trackingNumber,
                    shippingProviderCode: record.shippingProviderCode,
                },
                preferredDate: parseDate(record.reattemptDetails.preferred_date),
                customerDetails: {
                    phone: record.customerPhone,
                    email: record.customerEmail,
                    city: record.reattemptDetails.city,
                    state: record.reattemptDetails.state,
                    pincode: record.reattemptDetails.pincode,
                },
                deliveryAddress: {
                    city: record.reattemptDetails.city,
                    state: record.reattemptDetails.state,
                    address: record.reattemptDetails.address,
                    pincode: record.reattemptDetails.pincode,
                },
                created_at: parseDate(record.requestedAt),
                actions: record.status,
            }
            returnOrderList.push(buyerRequest)
        })
    } else {
        data.map((record: BuyerRequestData) => {
            const buyerRequest: BuyerColumns = {
                id: record.id,
                status: record.status,
                subRemark: record.rtoDetails.sub_remark,
                preferredDate: '',
                ShipmentDetails: {
                    id: record.trackingNumber,
                    shippingProviderCode: record.shippingProviderCode,
                },
                customerDetails: {
                    phone: record.customerPhone,
                    email: record.customerEmail,
                },
                deliveryAddress: {
                    address: record.customerAddress,
                },
                created_at: record.requestedAt,
                actions: record.status,
            }
            returnOrderList.push(buyerRequest)
        })
    }

    return returnOrderList
}
