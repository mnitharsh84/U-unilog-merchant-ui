import { FetchNonDeliveryReportsType, NdrTabStatus } from 'apis/get'

import { ReportsColumns } from './types/reports'

export function sanitiseData(apiResponse: FetchNonDeliveryReportsType | null | undefined): ReportsColumns[] {
    if (!apiResponse || !apiResponse.data) return []

    const { data } = apiResponse

    return data.map<ReportsColumns>((record) => ({
        ndrDetails: {
            id: record.ndr_id,
            date: record.last_ndr_date,
            attempts: `${record.attempts}`,
            reason: record.ndr_reason,
            pending: record.pending_since,
            severity: record.severity,
        },
        orderDetails: {
            id: record.channel_order_id,
            url: '#',
            amount: record.total_price,
            paymentMethod: record.payment_method,
            products: record.product_details.line_items.map((item) => ({
                sku: item.seller_sku_code,
                name: item.channel_product_name,
                price: item.total_price,
            })),
        },
        customerDetails: {
            name: record.customer_info.name,
            phone: record.customer_info.phone,
            email: record.customer_info.email,
            city: record.customer_info.city,
            pincode: record.customer_info.pincode,
            state: record.customer_info.state,
        },
        deliveryAddress: {
            country: record.delivery_address.country,
            pincode: record.delivery_address.pincode,
            address: record.delivery_address.address,
            city: record.delivery_address.city,
            state: record.delivery_address.state,
        },
        fieldExecutiveInfo: 'Unavailable',
        shipmentDetails: {
            id: record.tracking_number,
            carrier: record.shipping_provider,
            url: '#',
        },
        lastActionBy: record.action_by,
        actions: {
            showContactBuyer: record.properties.cb,
            showFakeAttempt: record.properties.sfa,
            showReattempt:
                record.properties.sr &&
                apiResponse.reattemptShippingSource.some((code) => code === record.shipping_provider),
            showRto:
                record.properties.sr && apiResponse.rtoShippingSource.some((code) => code == record.shipping_provider),
        },
        historyRow: record.ndr_id,
    }))
}

export const TAB_STATUS: NdrTabStatus[] = ['ACTION_REQUIRED', 'ACTION_TAKEN', 'DELIVERED', 'RTO']
