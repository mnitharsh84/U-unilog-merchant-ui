import { useFormikContext } from 'formik'
import { Dispatch, SetStateAction, useEffect } from 'react'
import FormField from 'shared/components/FormField/FormField'
import { Field, FieldType } from 'shared/types/forms'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { CustomFilters } from '../types/filters'

type Props<T extends FieldType> = {
    fieldKey: string
    field: Field<T>
    persistFilters: Dispatch<SetStateAction<CustomFilters>>
}

export default function FieldWrapper<T extends FieldType>({ fieldKey, field, persistFilters }: Props<T>) {
    const formik = useFormikContext()

    useEffect(() => {
        persistFilters((prevFilters) => ({
            ...prevFilters,
            [fieldKey]: {
                type: field.type,
                value: formik.values?.[fieldKey as keyof typeof formik.values] || INIT_VALUE_MAP[field.type],
            },
        }))
    }, [formik.values])

    return <FormField fieldKey={fieldKey} field={field} />
}
