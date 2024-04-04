import { Flex, Input, Text } from '@chakra-ui/react'
import { getIn, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { Field } from 'shared/types/form'

export default function TextInput({ field }: { field: Field<'text_input'> }) {
    const formik = useFormikContext()

    const error = getIn(formik.errors, field.fieldKey)
    const isTouched = getIn(formik.touched, field.fieldKey)
    const isInvalid = !!error && !!isTouched

    const onValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        formik.setFieldValue(field.fieldKey, value)
        if (field.onValueChange) field.onValueChange(event, formik)
    }

    return (
        <Flex direction={'column'} w={'100%'} gap={1}>
            {field.showLabel === false ? null : (
                <Text
                    as={'span'}
                    textStyle="formFieldLabel"
                    ps={3}
                    mt="4"
                    className={`${field.required ? 'required-field' : ''}`}
                >
                    {field.display}:
                </Text>
            )}
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
                {...formik.getFieldProps(field.fieldKey)}
                {...field.arguments.chakraProps}
                className={`${field.required === false ? '' : 'mandatory'}`}
                onChange={onValueChange}
            />
            {field.showErrorMessage && isInvalid && (
                <Text fontSize={'x-small'} color="crimson" ps={3}>
                    {error}
                </Text>
            )}
        </Flex>
    )
}
