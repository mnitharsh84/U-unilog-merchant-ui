import { Flex, Select, Text } from '@chakra-ui/react'
import { getIn, useFormikContext } from 'formik'
import { ChangeEvent } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { Field } from 'shared/types/form'

export default function SingleSelect({ field }: { field: Field<'select'> }) {
    const formik = useFormikContext()

    const error = getIn(formik.errors, field.fieldKey)
    const isTouched = getIn(formik.touched, field.fieldKey)
    const isInvalid = !!error && !!isTouched

    const options = field.arguments.options.filter((option) => !option.hidden)

    const onValueChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        formik.setFieldValue(field.fieldKey, selectedValue)
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
            <Select
                w={`100%`}
                size={'sm'}
                fontSize={'small'}
                background={'white'}
                borderRadius={'0.3rem'}
                isDisabled={field.editable === false}
                placeholder={field.placeholder ?? 'Select Option'}
                icon={<AiFillCaretDown fontSize={'14px'} />}
                isInvalid={isInvalid}
                errorBorderColor={'crimson'}
                className={`${field.required === false ? '' : 'mandatory'}`}
                {...formik.getFieldProps(field.fieldKey)}
                {...field.arguments.chakraProps}
                onChange={onValueChange}
            >
                {options.length ? (
                    options.map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.display}
                        </option>
                    ))
                ) : (
                    <option disabled>No Options Available</option>
                )}
            </Select>
            {field.showErrorMessage && isInvalid && (
                <Text fontSize={'x-small'} color="crimson" ps={3}>
                    {error}
                </Text>
            )}
        </Flex>
    )
}
