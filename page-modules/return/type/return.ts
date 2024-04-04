import { FieldType, FieldValue } from 'shared/types/forms'

export type ReturnDetailTabStatus = 'details' | 'customer' | 'activity'

export type ReturnTabStatus = 'ACTION_REQUIRED' | 'APPROVED' | 'CANCELLED' | 'COMPLETED' | 'DELETED'
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

export type RequestItem = {
    item_id: string
    sku_code: string
    bundle_sku_code: string
    seller_sku_code: string
    quantity: number
    approved_quantity: number
    reason_text: string
    sub_reason_text: string
    current_status: string
    channel_product_id: string
    tag: string
    channel_collection: string
    product_vendor: string
    sku_image: string
    product_display_name: string
    sell_price_all_inclusive: string
    oms_sale_order_item_codes: { [key: string]: any }
    created_at: string
    image_urls: string[]
    seller_approved_quantity: number
    buyer_reason_text: string
}

type BeneficiaryDetail = {
    code: string
    displayName: string
    value: string
}
export type ReturnRequest = {
    request_id: string
    facility_code: string
    bundle_identifier: string
    bundle_description: string
    current_status: string
    facility_address: { [key: string]: any }
    pickup_address: { [key: string]: any }
    pickup_address_changed: boolean
    shipping_provider: string | null
    oms_rvp_status: string | null
    reverse_pickup_code: string | null
    refund_mode: string
    refund_status: string
    shipping_option: string
    ecommerce_store_name: string
    rms_type: string
    seller_remark: string | null
    order_created_at: string
    order_fulfillment_tat: string
    bundle_image_urls: string[]
    return_created_at: string
    request_items: Array<RequestItem>
    beneficiary_details: BeneficiaryDetail[]
}
export type SellerReturnOrder = {
    display_order_code: string
    sale_order_code: string
    customer_phone: string
    customer_email: string
    return_request: ReturnRequest[]
}

export type SellerReturnOrderResponse = {
    data: Array<SellerReturnOrder>
    total: number
}
export type ReturnColumnRequestItem = {
    sku_image: string
    quantity: number
    product_display_name: string
}
export type RetrunsColumns = {
    display_order_code: string
    customer_email: string
    customer_phone: string
    request_items: ReturnColumnRequestItem[]
    request_id: string
    created_at: string
    sale_order_code: string
    order_created_at: string
    order_fulfillment_tat: string
    refund_mode: string
    shipping_option: string
    reverse_pickup_code: string
    oms_rvp_status: string
    refund_status: string
    shipping_provider: ShippingData[]
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
    bundleSkuCode: string
    bundle_identifier: string
    price: number
    taxDescription: string
    quantity: number
    totalPrice: number
    reasonText: string
    requestId: string
    saleOrderCode: string
    shippingOption: string
    mediaURLs: string[]
    refundMode: string
    beneficiaryDetails: BeneficiaryDetail[]
    item_id: string
    seller_approved_quantity: number
    approved_quantity: number
    refundStatus: string
    buyer_reason_text: string
    paymentMode: string
}

export type CustomerDetail = {
    pickupAddress: { [key: string]: any }
}

export type MasterRole = {
    code: string
    name: string
    type: string
}
export type BeneficiaryDetails = {
    code: string
    displayName: string
    value: string
}
export type Return = {
    paymentMode: string
    refundMode: string
    beneficiaryDetails: BeneficiaryDetails[]
    items: ProductDetail[]
    requestId: string
    refundStatus: string
}

export type REFUND_MODE = 'INELIGIBLE' | 'ELIGIBLE' | 'COMPLETED'

export type ChangeStateApiPayload = {
    requestIds: string[]
    saleOrderCode: string
    rmsType: RMSTYPE
    from: string
    to: string
}

type RequestIds = string[]

type RequestItemIdToQuantity = Record<string, number>

export type SaleOrderApprovalRequest = {
    saleOrderCode: string
    tenantCode?: string
    trackingNumber?: string
    shippingProviderCode?: string
    facilityCode?: string
    requestIds: RequestIds
    requestItemIdToQuantity?: RequestItemIdToQuantity
    action: string
    sellerRemark: string
}

export type ShippingProvider = {
    id: string
    sourceCode: string
    code: string
    key: string
    name: string
    ndrEnabled: boolean
}

export type ShippingProviderData = {
    data: ShippingProvider[]
}

type ReasonResponse = {
    buyer_text_required: boolean
    img_required: boolean
    max_img_require: number
    min_img_require: number
    reason_id: string
    reason_message: string
    reason_text: string
    sub_reason_required: boolean
    sub_reasons: { sub_reason_id: string; sub_reason_text: string }[]
}
export type BundleReturnResponse = {
    bundle_sku_code: string
    reasons: ReasonResponse[]
    return_eligible: boolean
}
export type SKUReturnResponse = {
    sku_code: string
    reasons: ReasonResponse[]
    return_eligible: boolean
}
export type GetLineItemReasonsResponse = {
    data: [BundleReturnResponse | SKUReturnResponse]
}

export type ExchangeReasonData = {
    skuCode?: string
    bundleSkuCode?: string
    exchangeReasonId: string
    exchangeSubReasonId?: string
}

export type ConvertExchangePayload = {
    returnRequestId: string
    reasonData: ExchangeReasonData[]
    remark?: string
}

export type ConvertToExchangeFormValues = {
    [key: string]: {
        exchangeReasonId: string
        exchangeSubReasonId?: string
        skuCode: string
        bundleSkuCode: string
    }
}

export type ConvertToExchangeApiResponse = {
    id: string
    successful: boolean
    message: string
}
export type RefundData = {
    selectedRequestId: string
    totalAmount: string
    approvedAmount: string
}
export type completeRefundItem = {
    returnId: string
    amount: number
}
export type CompleteRefundPayload = {
    items: completeRefundItem[]
    tenantCode?: string
    tenantChannel?: string
}

export type ManualApprovalData = {
    trackingNumber: string
    shippingProviderCode: string
    facilityCode?: string
}

export type ShippingData = {
    key: string
    display: string
    value: string
}
