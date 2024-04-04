export type Functions = {
    delete: (param: Array<any>) => void
}

export type AllTemplateComponentParams = {
    eventId: string
}

export type ShippingProviderType = {
    code: string
    name: string
}
export type DataList = {
    content: string
    display_name: string
    order_type: string
    shipping_providers: ShippingProviderType[]
    status: boolean
    template_id: string
    tenant_event_id: string
}

export type UpdateStatusPayload = {
    template_id: string
    tenant_event_id: string
    tenant_code: string
    order_type: string
    shipping_provider_codes: string[]
    enabled: boolean
}
