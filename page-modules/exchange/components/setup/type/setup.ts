import { dateRange } from 'shared/types/forms'

export type SetupPolicyDetail = {
    return_window_in_days: number
    exchange_window_in_days: number
    rms_restriction_period_start_date: string
    rms_restriction_period_end_date: string
    out_of_stock_exchange_enabled: boolean
    exchange_with_other_product_enabled: boolean
    multiple_item_returns_enabled: boolean
    return_fee_enabled: true
    return_fee: number
    exclusive_catalogs: ExclusiveCatalogs[]
}
export type ExclusiveCatalogs = {
    code: string
    displayName: string
    group: string
    imageUrl: string
    type: string
}
export type SetupPolicy = {
    version: number
    details: SetupPolicyDetail
}

export type SetupPolicyPayload = {
    return_window_in_days: number
    rms_restriction_period_start_date: string
    rms_restriction_period_end_date: string
    multiple_item_returns_enabled: boolean
    return_fee_enabled: boolean
    return_fee: number
}

export type FormData = {
    return_window_in_days: number
    rms_restriction_period: dateRange
    multiple_item_returns_enabled: string
    return_fee_enabled: string
    return_fee: number
}
export type DateFieldType = {
    startDate: { key: string }
    endDate: { key: string }
}
