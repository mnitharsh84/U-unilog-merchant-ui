import { InputProps, SelectProps } from '@chakra-ui/react'
import { FormikContextType } from 'formik'
import { ChangeEvent } from 'react'
import { RangeKeyDict } from 'react-date-range'
import { Schema } from 'yup'

export type FieldTypeToValue = {
    multi_select: string[]
    text_input: string
    select: string
    date: string
    daterange: any
    password_input: string
    multi_select_search: string
    multi_text_input: string
}

export type FieldTypeToArguments = {
    multi_select: { options: SelectOption[]; showSelectAll: boolean; chakraProps?: SelectProps } // TODO: Match with chakra elements used
    text_input: { chakraProps?: InputProps }
    select: { options: SelectOption[]; chakraProps?: SelectProps }
    date: { minDate?: string }
    daterange: { minDate?: string }
    password_input: { chakraProps?: InputProps }
    multi_select_search: { chakraProps?: SelectProps }
    multi_text_input: { chakraProps?: InputProps }
}

export type FieldTypeToChangeEventHandler = {
    multi_select: (event: ChangeEvent<HTMLInputElement>, formik: FormikContextType<unknown>) => void
    text_input: (event: ChangeEvent<HTMLInputElement>, formik: FormikContextType<unknown>) => void
    select: (event: ChangeEvent<HTMLSelectElement>, formik: FormikContextType<unknown>) => void
    date: (event: ChangeEvent<HTMLInputElement>, formik: FormikContextType<unknown>) => void
    daterange: (rangesByKey: RangeKeyDict, formik: FormikContextType<unknown>) => void
    password_input: (event: ChangeEvent<HTMLInputElement>, formik: FormikContextType<unknown>) => void
    multi_select_search: (event: ChangeEvent<HTMLSelectElement>, formik: FormikContextType<unknown>) => void
    multi_text_input: (event: ChangeEvent<HTMLInputElement>, formik: FormikContextType<unknown>) => void
}

export type FieldType = keyof FieldTypeToValue

export type Value<T extends FieldType> = FieldTypeToValue[T]

export type Arguments<T extends FieldType> = FieldTypeToArguments[T]
export type ChangeHandler<T extends FieldType> = FieldTypeToChangeEventHandler[T]

export type Field<T extends FieldType> = {
    fieldKey: string
    display: string
    hidden: boolean
    type: T
    init_value: Value<T>
    arguments: Arguments<T>
    validationSchema: Schema
    placeholder?: string
    editable?: boolean
    required?: boolean
    showErrorMessage?: boolean
    showLabel?: boolean
    onValueChange?: ChangeHandler<T>
}

export type SelectOption = {
    key: string
    display: string
    hidden: boolean
}

export type FormExtraInfoType = {
    extraInfo?: string
    info?: string
}
