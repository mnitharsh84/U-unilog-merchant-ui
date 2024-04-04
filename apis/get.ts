import { STATE_CODE_MAP } from 'page-modules/dashboard/overview/utils'
import { CustomFilters } from 'page-modules/ndr/types/filters'
import { FilterParams, SortParams, TimelineParams } from 'page-modules/tracking/orders/types/filters'
import { FieldType, FieldValue } from 'shared/types/forms'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import DomainHandler from './domain-handler'
import gateway from './gateway'

const domainHandler = new DomainHandler()

type TrackingDetails = {
    tracking_number: string
    shipping_source_code: string
    shipping_provider_code: string
    shipping_courier: string
    no_of_items: number
    shipping_type: string
    payment_method: string
    order_number: string
    shipping_package_code: string
    current_location: string
    expected_delivered_datetime: string
    dispatch_datetime: string
    delivered_datetime: string | null
    order_datetime: string
    current_wismo_display_status: string
    last_event_updated: string
    is_dispatched: boolean
    is_shipped: boolean
    is_out_for_delivery: boolean
    is_delivered: boolean
    delivery_city: string
    delivery_state_code: string
    delivery_address: string
    line_items: {
        total_price: string
        seller_sku_code: string
        channel_product_name: string
    }[]
    total_price: number
    customer_name: string
    customer_phone: string
    customer_email: string | null
    customer_feedback: string
    tenant_code: string
    facility_code: string
    stop_polling: boolean
    refresh_required: boolean
    brand_logo: string
    marketing: {
        banners: {
            alt: string
            src: string
        }[]
    }
    tracking_events: {
        tracking_status: string
        tracking_status_code: string | null
        tracking_status_remark: string | null
        tracking_location: string
        tracking_datetime: string
    }[]
}

type FetchShipmentDetails = {
    code: number
    description: string
    result: {
        tracking_details: TrackingDetails
    }
}

export async function fetchShipmentDetails(trackingNumber: string): Promise<FetchShipmentDetails> {
    return await gateway(
        `shipper/api/tracking-details?tr_number=${trackingNumber}`,
        {
            method: 'GET',
        },
        'SHIPPER_PANEL',
    )
}

type FetchMetaData = {
    code: number
    description: string
    result: {
        allowed_urls: string[]
        tenant_profile: {
            tenant_name: string
            user_name: string
        }
        tracking_page: {
            sort_by: { key: SortParams; display: string; hidden: boolean }[]
            status_filters: { key: FilterParams; display: string; hidden: boolean }[]
            time_range_filters: { key: TimelineParams; display: string; hidden: boolean }[]
        }
    }
}

export async function fetchMetadata(): Promise<FetchMetaData> {
    return await gateway(`api/system/meta`, { method: 'GET' }, 'SHIPPER_PANEL')
}

type ServerFields = {
    key: string
    display_name: string
    hidden: boolean
    type: FieldType
    default_value: [string | null]
}[]

type FetchExtendedMetadataServer = {
    code: number
    description: string
    result: {
        extended_meta: {
            group_search_criteria: ServerFields
        }
    }
}

type Fields = Record<
    string,
    {
        display: string
        hidden: boolean
        type: FieldType
        init_value: FieldValue
        options?: {
            key: string
            display: string
            hidden: boolean
        }[]
    }
>

type FetchExtendedMetadata = {
    code: number
    description: string
    result: {
        extended_meta: {
            group_search_criteria: Fields
        }
    }
}

function mapToFields(serverFields: ServerFields): Fields {
    const fields: Fields = {}

    serverFields.forEach((serverField) => {
        const options = serverField.default_value.filter(Boolean) as string[]

        fields[serverField.key] = {
            display: serverField.display_name,
            hidden: serverField.hidden,
            type: serverField.type,
            init_value: INIT_VALUE_MAP[serverField.type as FieldType],
            options: options.map((option) => {
                return { key: option, display: option, hidden: false }
            }),
        }
    })

    return fields
}

export async function fetchExtendedMetadata(): Promise<FetchExtendedMetadata> {
    const data = (await gateway(
        `api/system/get_extended_meta`,
        {
            method: 'GET',
        },
        'SHIPPER_PANEL',
    )) as FetchExtendedMetadataServer

    const mappedData: FetchExtendedMetadata = {
        code: data.code,
        description: data.description,
        result: {
            extended_meta: {
                group_search_criteria: mapToFields(data.result.extended_meta.group_search_criteria),
            },
        },
    }

    return mappedData
}

export type FetchNonDeliveryReportsType = {
    data: [
        {
            channel_order_id: string
            is_return: boolean
            shipping_method: string
            action: string
            tracking_number: string
            current_escalation_count: number
            payment_method: string
            attempts: number
            delivered_date: string
            ndr_reason: string
            customer_info: {
                name: string
                phone: string
                email: string
                city: string
                pincode: string
                state: string
            }
            ndr_raised_at: string
            shipment_id: string
            escalation_status: number
            shipping_provider: string
            current_status: string
            last_ndr_date: string
            channel_id: string
            total_price: number
            product_details: {
                line_items: [
                    {
                        total_price: string
                        seller_sku_code: string
                        channel_product_name: string
                    },
                ]
            }
            status: string
            created_at: string
            action_date: string
            action_by: string
            total: string
            ndr_id: string
            delivery_address: {
                country: string
                pincode: string
                address: string
                city: string
                state: string
            }
            channel_name: string
            courier_ndr_reason: string
            seller_remarks: string
            payment_status: string
            pending_since: string
            buyer_return: number
            properties: {
                sfa: boolean
                sr: boolean
                sra: boolean
                cb: boolean
            }
            severity: 'LOW' | 'HIGH'
            bd_escalate_btn: 0
        },
    ]
    meta: {
        total: number
        count: number
        total_pages: number
        current_page: number
    }
    reattemptShippingSource: string[]
    rtoShippingSource: string[]
}

export type NdrTabStatus = 'ACTION_REQUIRED' | 'ACTION_TAKEN' | 'DELIVERED' | 'RTO'
export async function fetchNonDeliveryReports({
    page,
    page_size,
    is_web,
    status,
    query_string,
    from,
    to,
    ndr_status,
    shipping_provider_code,
    customFilters,
}: {
    page: number
    page_size: number
    is_web: boolean
    status: NdrTabStatus
    query_string: string
    from: string
    to: string
    ndr_status: string[]
    shipping_provider_code: string[]
    customFilters: CustomFilters
    // aging?: number
    // attempts?: number
    // action_by?: 'SHIPPING_PROVIDER' | 'SYSTEM' | 'SELLER'
    // shipping_provider_code?: string
    // escalation_status?: number
}): Promise<FetchNonDeliveryReportsType> {
    return gateway(
        `session/api/v1/ndr/data?page=${domainHandler.encodeUriParams(page)}&page_size=${domainHandler.encodeUriParams(
            page_size,
        )}&is_web=${domainHandler.encodeUriParams(is_web)}&shipping_provider_code=${domainHandler.encodeUriParams(
            shipping_provider_code,
        )}&ndr_page=${domainHandler.encodeUriParams(status)}&query_string=${domainHandler.encodeUriParams(
            query_string,
        )}&from=${domainHandler.encodeUriParams(from)}&to=${domainHandler.encodeUriParams(
            to,
        )}&ndr_status=${domainHandler.encodeUriParams(ndr_status)}${Object.keys(customFilters).reduce<string>(
            (prev, key) => prev + `&${key}=${domainHandler.encodeUriParams(customFilters[key].value)}`,
            '',
        )}`,
        {
            method: 'GET',
            headers: {
                'APP-KEY': '#$%^SK&SNLSH*^%SF',
                'content-type': 'application/json',
                'accept': '*/*',
            },
        },
    )
}
interface summary {
    title: string
    value: number
}
interface FetchNdrShortSummaryType {
    summary_items: summary[]
}
export async function fetchNdrShortSummary(startDate: string, endDate: string): Promise<FetchNdrShortSummaryType> {
    return await gateway(`session/api/v1/ndr/reports/short-summary?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
    })
}

// export interface dateRangeType {
//     start_date: string
//     end_date: string
// }

export type NdrStatusSplitResult = {
    'Delivered': number
    'RTO': number
    'Pending': number
    'Lost/Damaged': number
    'date_range': string
}

export type FetchNdrStatusSplitType = NdrStatusSplitResult[]

export async function fetchNdrStatusSplit(startDate: string, endDate: string): Promise<NdrStatusSplitResult[]> {
    return await gateway(`session/api/v1/ndr/reports/status-split?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
    })
}

export type FetchNdrFilterMetadataType = {
    data: NdrFilter[]
}
export type NdrFilter = {
    key: string
    type: FieldType
    enable: boolean
    order: number
    placeHolder: string
    display: string
    option: {
        key: string
        display: string
        enable: boolean
        order: number
        default: boolean
    }[]
    page_key: 'NDR_PAGE_FILTER' | 'action_required' | 'action_requested' | 'rto' | 'delivered'
}
export async function fetchNdrFilterMetadata(filterKey: string): Promise<FetchNdrFilterMetadataType> {
    return await gateway(`api/v1/filter/metadata?filter_key=${filterKey}`, {
        headers: {},
    })
}

type NdrReasonResponse = {
    'Delivered shipments': string | number
    'Lost/Damaged/Unknown shipments': string | number
    'Pending shipments': string | number
    'RTO shipments': string | number
    'Total NDRs Raised (1 shipment may have multiple reports)': string | number
    'reason': string
}
export type FetchNdrReasonSplitType = {
    pie_chart: {
        title: string
        value: number
    }[]
    reason_wise_count_details: NdrReasonResponse[]
}
export async function fetchNdrReasonSplit(startDate: string, endDate: string): Promise<FetchNdrReasonSplitType> {
    return await gateway(`session/api/v1/ndr/reports/reason-split?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
    })
}

export type NdrFunnelType = {
    title: string
    value: string | number
}

export type NdrFunnelCountType = {
    counts: NdrFunnelType[]
    cycle: string
}

export type FetchNdrFunnelType = {
    cycle_wise_counts: NdrFunnelCountType[]
}

export async function fetchNdrFunnels(startDate: string, endDate: string): Promise<FetchNdrFunnelType> {
    return await gateway(`session/api/v1/ndr/reports/funnel?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
    })
}

export type LogoutResponseType = {
    code: number
    description: string
    result: object
}

export async function initLogout(): Promise<LogoutResponseType> {
    return await gateway(`api/seller/logout`, { method: 'GET' }, 'SHIPPER_PANEL')
}

export type FetchNdrHistoryType = {
    historyData: Record<
        string,
        {
            action: string
            action_by: string
            date: string
            history_id: string
            ndr_cycle: number
            ndr_instruction_update: string
            reason: string
            remarks: string
            shipping_provider: string
            shipping_provider_id: string
            source: string
        }[]
    >
}
export async function fetchNdrHistory(id: string): Promise<FetchNdrHistoryType> {
    return await gateway(`session/api/v1/ndr/history?ndr_id=${id}`, {
        method: 'GET',
    })
}

export type FetchNdrSuccessByCourierType = {
    courier_wise_ndr_success: {
        counts: {
            title: 'Raised & Delivered' | 'Raised'
            value: string
        }[]
        courier: string
        delivered_percentage: number
    }[]
    overall: {
        counts: {
            title: 'Total NDR Raised shipments' | 'Total NDR Raised & Delivered shipments'
            value: string
        }[]
        delivered_percentage: number
    }
}
export async function fetchNdrSuccessByCourier(
    startDate: string,
    endDate: string,
): Promise<FetchNdrSuccessByCourierType> {
    return await gateway(`session/api/v1/ndr/reports/courier-success?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
    })
}

export type FetchNdrTerminatedCountsType = {
    'date_range': string
    'Total NDR shipments': number
    'Terminated': number
}[]
export async function fetchNdrTotalTerminatedCounts(
    startDate: string,
    endDate: string,
): Promise<FetchNdrTerminatedCountsType> {
    return await gateway(
        `session/api/v1/ndr/reports/total-terminated-counts?start_date=${startDate}&end_date=${endDate}`,
        { method: 'GET' },
    )
}

export type FetchShippingProvidersType = {
    data: {
        id: string
        sourceCode: string
        code: string
        key: string
        name: string
        ndrEnabled: boolean
    }[]
}
export async function fetchShippingProviders(): Promise<FetchShippingProvidersType> {
    return await gateway(`api/v1/filter/shipping-provider`, { method: 'GET' })
}

export type NdrExportMutationType = {
    is_web: boolean
    status: NdrTabStatus
    query_string: string
    from: string
    to: string
    ndr_status: string[]
    shipping_provider_code: string[]
    customFilters: CustomFilters
}

export async function initiateDatatableExport({
    is_web,
    status,
    query_string,
    from,
    to,
    ndr_status,
    shipping_provider_code,
    customFilters,
}: NdrExportMutationType): Promise<NdrExportMutationType> {
    return await gateway(
        `session/api/v1/exports/ndr-data?is_web=${domainHandler.encodeUriParams(
            is_web,
        )}&shipping_provider_code=${domainHandler.encodeUriParams(
            shipping_provider_code,
        )}&ndr_page=${domainHandler.encodeUriParams(status)}&query_string=${domainHandler.encodeUriParams(
            query_string,
        )}&from=${domainHandler.encodeUriParams(from)}&to=${domainHandler.encodeUriParams(
            to,
        )}&ndr_status=${domainHandler.encodeUriParams(ndr_status)}${Object.keys(customFilters).reduce<string>(
            (prev, key) => prev + `&${key}=${domainHandler.encodeUriParams(customFilters[key].value)}`,
            '',
        )}`,
        { method: 'GET' },
    )
}

export type FetchStateSplitType = {
    category: string
    state_wise_count: {
        title: keyof typeof STATE_CODE_MAP
        value: number
    }[]
}[]
export async function fetchStateSplit(): Promise<FetchStateSplitType> {
    return await gateway(`session/api/v1/overview-dashboard/categorical-state-split`, { method: 'GET' })
}

export type FetchExportProgressType = {
    display_name: string
    completed: boolean
    file_url: string
    timestamp: string
}[]
export async function fetchExportProgress(): Promise<FetchExportProgressType> {
    return await gateway(`session/api/v1/exports/progress`, { method: 'GET' })
}

export type FetchImportProgressType = {
    display_name: string
    completed: boolean
    file_url: string
    timestamp: string
    status: 'COMPLETE' | 'SCHEDULED' | 'RUNNING' | 'FAILED'
}[]
export async function fetchImportProgress(): Promise<FetchImportProgressType> {
    return await gateway('session/api/v1/imports/progress', { method: 'GET' })
}

export type FetchOverviewSummaryType = Record<'shipment_details' | 'ndr_details', { title: string; value: number }[]>
export async function fetchOverviewSummary(): Promise<FetchOverviewSummaryType> {
    return await gateway(`session/api/v1/overview-dashboard/short-summary`, { method: 'GET' })
}

export type FetchOverviewStatusSplitType = {
    title: string
    value: number
}[]
export async function fetchOverviewStatusSplit(): Promise<FetchOverviewStatusSplitType> {
    return await gateway(`session/api/v1/overview-dashboard/status-split`, { method: 'GET' })
}

export type FetchOverviewDeliveryPerformanceSplitType = {
    title: string
    value: number
}[]
export async function fetchOverviewDeliveryPerformanceSplit(): Promise<FetchOverviewDeliveryPerformanceSplitType> {
    return await gateway(`session/api/v1/overview-dashboard/delivery-performance-split`, { method: 'GET' })
}

export type FetchOverviewCourierSplitType = {
    title: string
    value: number
}[]
export async function fetchOverviewCourierSplitType(): Promise<FetchOverviewCourierSplitType> {
    return await gateway(`session/api/v1/overview-dashboard/courier-split`, { method: 'GET' })
}

export type FetchOverviewCourierWiseReportType = {
    'Courier': string
    'In Transit': number
    'Delivered': number
    'NDR Raised': number
    'NDR Delivered': number
    'NDR Pending': number
    'RTO': number
    'Out For Delivery': number
    'Total Shipments': number
}[]
export async function fetchOverviewCourierWiseReport(): Promise<FetchOverviewCourierWiseReportType> {
    return await gateway(`session/api/v1/overview-dashboard/courier-wise-report`, { method: 'GET' })
}

export type DownloadableReportType = {
    display_name: string
    name: string
}

export async function fetchDownloadableReports(): Promise<DownloadableReportType[]> {
    return await gateway(`session/api/v1/exports/items`, { method: 'GET' })
}
export async function fetchExportItems(configName: string | null): Promise<any> {
    return await gateway(`session/api/v1/exports/items?config_name=${configName}`, { method: 'GET' })
}

export async function getCommunicationEventConfiguration(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
export async function getCommunicationChannelConfiguration(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}

export async function getCommunicationTemplatesConfiguration(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}

export async function getAllTeams(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}

export async function getAllRoles(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
export async function getTeamUsers(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
export async function getSetupPolicy(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
export async function getSearchUser(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
export async function getRmsReason(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}

export async function getSearchApi(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
