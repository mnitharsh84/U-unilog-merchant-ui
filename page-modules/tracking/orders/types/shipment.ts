export interface ShipmentsColumns {
    shippingProvider: { awb: string; courier: string }
    orderDetails: {
        saleOrder: string
        shippingPackage: string
        channelOrderCode: string
    }
    customer: { name: string; phone: string }
    facility: string
    courierStatus: string
    trackingStatus: string
    orderDate: string
    dispatchDate: string
    expectedDeliveryDate: string
    deliveryDate: string
    placeOfOrder: string
    totalDeliveryTime: string | number
    line_items?: string
}
