export type ACTIONS = {
    allowEdit: boolean
}

export type WarehouseColumns = {
    name: string
    code: string
    address: {
        addressLine1: string
        addressLine2: string
        city: string
        stateCode: string
        countryCode: string
        pincode: string
    }
    enabled: boolean
    omsCode: string
    phone: string
    email: string
    actions: ACTIONS
}

export enum WarehouseServiceabilityOptions {
    TO_ALL = 'TO_ALL',
    TO_SELECTED = 'TO_SELECTED',
    TO_ALL_EXCEPT_SELECTED = 'TO_ALL_EXCEPT_SELECTED',
}

export type WarehouseData = {
    name: string
    warehouse_code: string
    address_line_1: string
    address_line_2: string
    city: string
    state_code: string
    country_code: string
    pincode: string
    gstin: string
    enabled: boolean
    oms_code: string
    phone: string
    email: string
    process_time_value: string
    process_time_unit: string
    buffer_time: string
    cut_off_time: string
    serviceable_type: WarehouseServiceabilityOptions
    areAllSkusFulfillable: boolean
    selected_pincodes?: string
}
