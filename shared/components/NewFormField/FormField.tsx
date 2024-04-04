import { Field, FieldType } from 'shared/types/form'

import MultiSelect from './MultiSelect/MultiSelect'
import SingleSelect from './SingleSelect/SingleSelect'
import TextInput from './TextInput/TextInput'

export default function FormField<T extends FieldType>({ field }: { field: Field<T> }) {
    switch (field.type) {
        case 'multi_select':
            return <MultiSelect field={field as Field<'multi_select'>} />
        case 'select':
            return <SingleSelect field={field as Field<'select'>} />
        case 'text_input':
            return <TextInput field={field as Field<'text_input'>} />
        default:
            return <></>
    }
}
