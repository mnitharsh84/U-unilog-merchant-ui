import { Input } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { Field } from 'shared/types/forms'

type Props = {
    fieldKey: string
    field: Field<'date'>
}

export default function Date({ fieldKey, field }: Props) {
    const formik = useFormikContext()

    return (
        <Input
            type={'date'}
            w={`100%`}
            size={'sm'}
            fontSize={'small'}
            background={'white'}
            borderRadius={'0.3rem'}
            placeholder={field.placeholder ?? 'Select Date'}
            isDisabled={field.editable === false}
            isInvalid={
                !!(formik.touched as Record<string, boolean>)[fieldKey] &&
                !!(formik.errors as Record<string, string>)[fieldKey]
            }
            errorBorderColor={'crimson'}
            className={`${!field.editable ? 'mandatory' : ''}`}
            {...formik.getFieldProps(fieldKey)}
            {...(field.minDate ? { min: field.minDate } : {})}
        />
    )
}
