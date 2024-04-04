export type NDR_DETAILS = {
    id: string
    date: string
    attempts: string
    reason: string
    pending: string
    severity: 'LOW' | 'HIGH'
}

export type ORDER_DETAILS = {
    id: string
    url: string
    amount: number
    paymentMethod: string
    products: { sku: string; name: string; price: string }[]
}
export type CUSTOMER_DETAILS = {
    name: string
    phone: string
    email: string
    city: string
    pincode: string
    state: string
}
export type DELIVERY_ADDRESS = {
    city: string
    state: string
    address: string
    pincode: string
    country: string
}
export type SHIPMENT_DETAILS = {
    id: string
    carrier: string
    url: string
}
export type ACTIONS = {
    showFakeAttempt: boolean
    showRto: boolean
    showReattempt: boolean
    showContactBuyer: boolean
}

export type ReportsColumns = {
    ndrDetails: NDR_DETAILS
    orderDetails: ORDER_DETAILS
    customerDetails: CUSTOMER_DETAILS
    deliveryAddress: DELIVERY_ADDRESS
    fieldExecutiveInfo: string
    shipmentDetails: SHIPMENT_DETAILS
    lastActionBy: string
    actions: ACTIONS
    historyRow: string
}
