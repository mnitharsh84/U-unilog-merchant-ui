export type Functions = {
    redirectToEvent: (param: Array<any>) => void
}

export type DataList = {
    channelCode: string
    tenantCommunicationChannelId: string
    channelName: string
    iconUrl: string
    status: boolean
    configuredEvents: string[]
    communicationProviderName: string
}

export type DataType = {
    data: DataList[]
}

export type UpdateStatusItems = {
    communication_channel_id: string
    enabled: boolean
}
export type UpdateStatusPayload = {
    tenant_code: string
    tenantChannel?: string
    items: UpdateStatusItems[]
}
