export type CUSTOMER_DETAILS = {
    phone: string
    email: string
    city?: string
    pincode?: string
    state?: string
}
export type DELIVERY_ADDRESS = {
    city?: string
    state?: string
    address: string
    pincode?: string
}

export type ShipmentDetails = {
    id: string
    shippingProviderCode: string
}

export type BuyerColumns = {
    id: string
    status: string
    ShipmentDetails: ShipmentDetails
    preferredDate: string
    customerDetails: CUSTOMER_DETAILS
    subRemark: string
    deliveryAddress: DELIVERY_ADDRESS
    created_at: string
    actions: string
}

export type BuyerTabStatus = 'REATTEMPT' | 'MARK_RTO'

export type PageFilters = {
    startDate: string
    endDate: string
    searchText: string
}

export type Functions = {
    CLOSE: (param: Array<any>) => void
    DISCARD: (param: Array<any>) => void
}

export type ReattemptDetails = {
    ndrAction: string
    userType: string
    trackingNumber: string
    sub_remark: string
    remark: string
    address: string
    landmark: string
    pincode: string
    city: string
    state: string
    preferred_date: string // Assuming this is a string representing a date
    phone_number: string
    is_customer_picked_call: boolean
}

export type RtoDetails = {
    ndrAction: string
    userType: string
    trackingNumber: string
    remark: string
    sub_remark: string
    is_customer_picked_call: boolean
}

export type BuyerRequestData = {
    id: string
    action: string
    status: string
    trackingNumber: string
    shippingProviderCode: string
    shippingSourceCode: string
    reattemptDetails: ReattemptDetails
    rtoDetails: RtoDetails
    customerPhone: string
    customerEmail: string
    customerAddress: string
    requestedAt: string // Assuming this is a string representing a date
    lastModifiedAt: string // Assuming this is a string representing a date
}

export type BuyerRequestResponse = {
    data: BuyerRequestData[]
    meta: {
        total: number
        count: number
        total_pages: number
        current_page: number
    }
}

export type ACTIONS = {
    actionName: 'CLOSE' | 'DISCARD'
}

export type BuyerRequestClosedApiResponse = {
    requestId: string
    status: boolean
    message: string
}
