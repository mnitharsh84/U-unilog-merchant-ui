import { FieldType, FieldValue } from './forms'

export type TabDetail = {
    index: number
    breadcrumb: string
    key: string
}

type FilterObject = {
    type: FieldType
    value: FieldValue
}

export type CustomFilters = {
    [key: string]: FilterObject
}
