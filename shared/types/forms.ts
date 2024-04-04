import { Schema } from 'yup'

export type FieldTypeToValue = {
    multi_select?: string[]
    text_input?: string
    select?: string
    date?: string
    daterange?: any
    password_input?: string
    multi_select_search?: string
    multi_text_input?: string
}

export type FieldType = keyof FieldTypeToValue

export type FieldValue = FieldTypeToValue[FieldType]

type Value<T extends FieldType> = FieldTypeToValue[T]

export type FieldOptions = {
    key: string
    display: string
    hidden: boolean
}

export type FieldOptionsExtendedFormField = {
    key: string
    display: string
    hidden: boolean
    code?: string
    displayName?: string
    type?: string
    imageUrl?: string
    group?: string
}

export type Field<T extends FieldType> = {
    display: string
    hidden: boolean
    type: T
    init_value: Value<T>
    placeholder?: string
    editable?: boolean
    options?: FieldOptions[]
    minDate?: string
    required?: boolean
    showErrorMessage?: boolean
    showSelectAll?: boolean
}
export type selectOption = {
    name: string
    display_name: string
}

export type field = {
    id: string
    display_name: string
    type: string
    options?: Array<selectOption>
    required?: boolean
}

export type formField = {
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
    showErrorMessage?: boolean
    showSelectAll?: boolean
}

export type dateRange = {
    startDate?: Date | null
    endDate?: Date | null
}

export type ExtendedFormField<T extends FieldType> = {
    key: string
    type: FieldType
    placeHolder?: string
    display: string
    initValue: FieldValue
    validation?: Schema
    editable?: boolean
    options?: FieldOptionsExtendedFormField[]
    minDate?: string
    required?: boolean
    showErrorMessage?: boolean
    info?: string
    extraInfo?: string
    original_type?: string
    textBoxLimit?: number
    subFormFields?: ExtendedFormField<T>[]
    isSubField?: boolean
    valuesAndPrompts?: any[]
    removeable?: boolean
    apiDetail?: SearchFieldApiDetail
    fetch_value_set_from_oms?: boolean
}

export type SearchFieldApiDetail = {
    url: string
    queryParams: Array<{ [key: string]: string }>
}
