export type AllEventComponentParams = {
    channelCode: string
    providerName: string
}

export type Functions = {
    viewTemplate: (param: Array<any>) => void
}

export type EventData = {
    eventId: string
    channelCode: string
    channelName: string
    eventName: string
    status: boolean
    templateNames: string[]
    notificationGroupName?: string
    groupIndex?: number
}

export type EventConfigDetail = {
    communicationChannel: string
    notificationGroupName: string
    notificationTitle: string
    eventData: EventData[]
}
export type PayloadItems = {
    tenant_event_id: string
    enabled: boolean
}
export type UpdateEventConfigPaylod = {
    tenant_code: string
    items: Array<PayloadItems>
}
