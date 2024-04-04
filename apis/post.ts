import { exportJobPayload } from 'page-modules/reports/hooks/queries'
import { Filters } from 'page-modules/tracking/orders/types/filters'
import { FieldValue } from 'shared/types/forms'

import gateway, { initAuth } from './gateway'

export type FetchShipmentsType = {
    code: number
    description: string
    result: {
        username: string
        tracking_records: {
            tracking_number: string
            shipping_source_code: string
            channel_order_code: string
            order_number: string
            shipping_package_code: string
            facility_code: string
            courier_status: string
            current_wismo_display_status: string
            order_datetime: string
            dispatch_datetime: string
            expected_delivered_datetime: string
            delivered_datetime: string | null
            no_of_items: number
            payment_method: string
            shipping_type: string
            customer_name: string
            customer_phone: string
            tenant_code: string
            line_items?: string
            total_delivery_time?: number
            place_of_order?: string
        }[]
        refresh_required?: boolean
    }
}
export async function fetchShipments(filters: Filters): Promise<FetchShipmentsType> {
    const { from, to, timeline, sortBy, filterBy, searchText, customFilters } = filters

    const group_search_criteria: Record<string, FieldValue> = {}
    Object.keys(customFilters).forEach((key) => {
        group_search_criteria[key] = customFilters[key].value
    })

    return gateway(
        `shipper/api/tracking-list`,
        {
            method: 'POST',
            body: JSON.stringify({
                to: to || null,
                from: from || null,
                sort_by: sortBy,
                time_range_filters: timeline,
                filters: filterBy,
                search_text: searchText,
                group_search_criteria,
            }),
        },
        'SHIPPER_PANEL',
    )
}

export type FetchAuthTokenType = {
    code: string
    description: string
    result: {
        jwt: string
    }
}
export async function fetchAuthGrant(session_id: string): Promise<FetchAuthTokenType> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    headers.append('AUTH-TYPE', 'jwt_only')
    return initAuth(`api/seller/auth_jwt`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            'SESSION-ID': session_id,
        }),
    })
}

export type ReattemptNDRType = {
    trackingNumber: string
    address: string
    landmark: string | undefined
    pincode: string
    remark: string
    sub_remark: string | undefined
    preferred_date: string
    phone_number: string
    is_customer_picked_call: boolean
    city: string
    state: string
}
export async function reattemptNDR(payload: ReattemptNDRType) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return gateway(`session/api/v1/ndr/reattempt`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    })
}

export type RtoNDRType = {
    trackingNumber: string
    remark: string
    subRemark: string
    is_customer_picked_call: boolean
}
export async function rtoNDR(payload: RtoNDRType) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return gateway(`session/api/v1/ndr/rto`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    })
}

export type FakeAttemptNDRType = {
    ndrId: string
    subRemark: string
    is_customer_picked_call: boolean
}
export async function fakeAttemptNDR(payload: FakeAttemptNDRType) {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return gateway(`session/api/v1/ndr/mark-fake-attempt`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
    })
}

export async function initReportJobExecution(payload: exportJobPayload): Promise<object> {
    return await gateway(`session/api/v1/exports/job-execution`, { method: 'POST', body: JSON.stringify(payload) })
}

export async function patchCommunicationChannelConfiguration(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}

export async function patchCommunicationChannelConfigurationEvent(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}

export async function patchCommunicationChannelTemplate(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function postCreateTeam(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function putEditTeam(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function postCreateUser(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}
export async function putUpdateUser(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function postAssociateUserToTeam(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}
export async function putSetupPolicy(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}
export async function putRmsReason(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function postReturnOrderAction(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}

export async function postChangeStateAction(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PUT', headers, body: JSON.stringify(data) })
}

export async function postMarkRefundComplete(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}
