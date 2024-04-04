import { Input, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { Field } from 'shared/types/forms'

type Props = {
    fieldKey: string
    field: Field<'text_input'>
}

export default function TextInput({ fieldKey, field }: Props) {
    const formik = useFormikContext()
    const nestedError = getIn(formik.errors, fieldKey)
    // Access the touched status for the nested field
    const nestedTouched = getIn(formik.touched, fieldKey)
    // Check if the field is touched to determine if it's invalid
    const isInvalid = nestedTouched && nestedError
    return (
        <>
            <Input
                w={`100%`}
                size={'sm'}
                fontSize={'small'}
                background={'white'}
                borderRadius={'0.3rem'}
                placeholder={field.placeholder ?? 'Enter input'}
                isDisabled={field.editable === false}
                isInvalid={isInvalid}
                errorBorderColor={'crimson'}
                {...formik.getFieldProps(fieldKey)}
                className={`${!field.editable ? 'mandatory' : ''}`}
            />
            {field.showErrorMessage && (
                <Text fontSize={'x-small'} color="crimson">
                    {isInvalid}
                </Text>
            )}
        </>
    )
}
