import { FieldType, FieldValue } from 'shared/types/forms'
import { Schema } from 'yup'

export type Filter = {
    key: string
    type: FieldType
    placeHolder?: string
    display: string
    initValue: FieldValue
    validation?: Schema
    editable?: boolean
    options?: {
        key: string
        display: string
    }[]
    minDate?: string
    required?: boolean
}
export type selectOption = {
    name: string
    display_name: string
}
export type exportItemFiltertype = {
    id: string
    display_name: string
    type: string
    options?: Array<selectOption>
    required?: boolean
}
export type columnType = selectOption
export type fetchExportItemApiResponse = {
    columns: Array<columnType>
    display_name: string
    filters: Array<exportItemFiltertype>
    name: string
}
export type dateRange = {
    startDate?: Date | null
    endDate?: Date | null
}

export type State = {
    selectedReport: string | null
    FILTERS: Filter[]
    availableColumns: columnType[]
    selectAll: boolean
    selectedColumns: columnType[]
    columnTypeMapping: { [key: string]: string }
}
