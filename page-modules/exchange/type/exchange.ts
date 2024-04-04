import { FieldType, FieldValue } from 'shared/types/forms'

export type ReturnDetailTabStatus = 'details' | 'customer' | 'activity'

export type ExchangeTabStatus = 'ACTION_REQUIRED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'DELETED'
export type RMSTYPE = 'RETURN' | 'EXCHANGE'
export type AllReasonsParams = {
    doActionReasons: (params: any) => any
    refetchAllReasonsQuery: boolean
    refetchCompleted: () => any
}

export type ActionData = {
    rowIndex: number
}

export type PageFilters = {
    startDate: string
    endDate: string
    searchText: string
}

export type CustomFilters = {
    [key: string]: {
        type: FieldType
        value: FieldValue
    }
}

export type ExchangeColumnRequestItem = {
    sku_image: string
    quantity: number
    product_display_name: string
}

export type ExchangeColumns = {
    display_order_code: string
    customer_email: string
    customer_phone: string
    exchange_items: ExchangeColumnRequestItem[]
    request_id: string
    return_created_at: string
    sale_order_code: string
    order_created_at: string
    order_fulfillment_tat: string
    shipping_option: string
    reverse_pickup_code: string
    oms_rvp_status: string
    shipping_provider: { [key: string]: any }
    replacement_sale_order_code: string
}

export type Functions = {
    viewOrder: (param: Array<any>) => void
}

export type toolbarButton = {
    doAction: (params: any) => any
    title: string
    actionName: string
    colorScheme?: string
}

export type ProductDetail = {
    fullfilmentData: string
    created_at: string
    requestedDaysBefore: number
    skuImage: string
    name: string
    sellerSkuCode: string
    skuCode: string
    price: number
    taxDescription: string
    quantity: number
    totalPrice: number
    reasonText: string
    requestId: string
    saleOrderCode: string
    shippingOption: string
    mediaURLs: string[]
    beneficiaryDetails?: { code: string; displayName: string; value: string }[]
    item_id: string
    seller_approved_quantity: number
    approved_quantity: number
    seller_remark: string
    buyer_reason_text: string
}

export type CustomerDetail = {
    pickupAddress: { [key: string]: any }
}

export type MasterRole = {
    code: string
    name: string
    type: string
}

export type AccessMetaDataApiResponse = {
    data: AccessMetaData[]
    returnMergeEnable: boolean
}
export type AccessMetaData = {
    access_url: string
    master_role: MasterRole[]
}

export type Exchange = {
    items: ProductDetail[]
    requestId: string
}

export type REFUND_MODE = 'INELIGIBLE' | 'ELIGIBLE' | 'COMPLETED'

export interface FacilityAddress {
    additionalProp1: Record<string, unknown>
    additionalProp2: Record<string, unknown>
    additionalProp3: Record<string, unknown>
}

export interface PickupAddress {
    country: string
    pincode: string
    city: string
    phone: string
    name: string
    addressLine1: string
    addressLine2: string
    id: string
    state: string
    email: string
    type: string
}

export interface ShipmentTracking {
    reversePickupCode: string
    shippingProviderCode: string
    shippingSourceCode: string
    trackingNumber: string
}

export interface ShippingProvider {
    shipmentTracking: ShipmentTracking
    manualRVPS: string[]
}

export interface ExchangeItem {
    item_id: string
    sku_code: string
    bundle_sku_code: string
    seller_sku_code: string
    quantity: number
    seller_approved_quantity: number
    approved_quantity: number
    reason_text: string
    sub_reason_text: string
    buyer_reason_text: string
    current_status: string
    channel_product_id: string
    tag: string
    channel_collection: string
    product_vendor: string
    sku_image: string
    product_display_name: string
    image_urls: string[]
    sell_price_all_inclusive: number
    created_at: string
}

export interface ExchangeRequest {
    request_id: string
    facility_code: string
    bundle_identifier: string
    bundle_description: string
    current_status: string
    facility_address: FacilityAddress
    pickup_address: PickupAddress
    pickup_address_changed: boolean
    shipping_provider: ShippingProvider
    oms_rvp_status: string
    reverse_pickup_code: string
    replacement_sale_order_code: string
    shipping_option: string
    ecommerce_store_name: string
    rms_type: string
    seller_remark: string
    order_created_at: string
    order_fulfillment_tat: string
    bundle_image_urls: string[]
    return_created_at: string
    exchange_items: ExchangeItem[]
}

export interface ExchangeData {
    display_order_code: string
    sale_order_code: string
    customer_phone: string
    customer_email: string
    exchange_request: ExchangeRequest[]
}

export interface ExchangeResponse {
    data: ExchangeData[]
    total: number
}
