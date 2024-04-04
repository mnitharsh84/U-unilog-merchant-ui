import { FieldType, FieldValue } from 'shared/types/forms'

export type PageFilters = {
    searchText: string
    startDate: string
    endDate: string
    ndrReasons: string[]
    shippingProviders: string[]
}

export type CustomFilters = {
    [key: string]: {
        type: FieldType
        value: FieldValue
    }
}
