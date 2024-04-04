import ToolbarProvider from 'page-modules/dashboard/ToolbarProvider'
import { Field, FieldType, SearchFieldApiDetail } from 'shared/types/forms'

import Date from './Date/Date'
import DateRange from './DateRange/DateRange'
import MultiSelect from './MultiSelect/MultiSelect'
import MultiSelectSearch from './MultiSelect/MultiSelectSearch'
import MultipleTextInput from './MultipleTextInput/MultipleTextInput'
import PasswordInput from './PasswordInput/PasswordInput'
import SingleSelect from './SingleSelect/SingleSelect'
import TextInput from './TextInput/TextInput'

type Props<T extends FieldType> = {
    fieldKey: string
    field: Field<T>
    changeValue?: (param: {
        value: string
        field: Field<'multi_select' | 'select' | 'multi_select_search'>
        fieldKey: string
    }) => void
    searchFieldApiDetail?: SearchFieldApiDetail
}

export default function FormField<T extends FieldType>({
    field,
    fieldKey,
    changeValue,
    searchFieldApiDetail,
}: Props<T>) {
    switch (field.type) {
        case 'multi_select':
            return <MultiSelect changeValue={changeValue} fieldKey={fieldKey} field={field as Field<'multi_select'>} />
        case 'select':
            return <SingleSelect changeValue={changeValue} fieldKey={fieldKey} field={field as Field<'select'>} />
        case 'text_input':
            return <TextInput fieldKey={fieldKey} field={field as Field<'text_input'>} />
        case 'date':
            return <Date fieldKey={fieldKey} field={field as Field<'date'>} />
        case 'daterange':
            return (
                <ToolbarProvider>
                    <DateRange fieldKey={fieldKey} field={field as Field<'daterange'>} />{' '}
                </ToolbarProvider>
            )
        case 'password_input':
            return <PasswordInput fieldKey={fieldKey} field={field as Field<'password_input'>} />
        case 'multi_select_search':
            return (
                <MultiSelectSearch
                    searchFieldApiDetail={searchFieldApiDetail}
                    changeValue={changeValue}
                    fieldKey={fieldKey}
                    field={field as Field<'multi_select_search'>}
                />
            )
        case 'multi_text_input':
            return <MultipleTextInput fieldKey={fieldKey} field={field as Field<'multi_text_input'>} />
        default:
            return <></>
    }
}
