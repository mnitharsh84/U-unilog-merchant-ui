import { Select } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { ChangeEvent } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { Field } from 'shared/types/forms'

type Props = {
    fieldKey: string
    field: Field<'select'>
    changeValue?: (param: { value: any; field: Field<'select'>; fieldKey: string }) => void
}

export default function SingleSelect({ fieldKey, field, changeValue }: Props) {
    const formik = useFormikContext()
    // Access the error for the nested field
    const nestedError = getIn(formik.errors, fieldKey)
    // Access the touched status for the nested field
    const nestedTouched = getIn(formik.touched, fieldKey)
    // Check if the field is touched to determine if it's invalid
    const isInvalid = nestedTouched && nestedError
    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value
        // Call the changeValue callback if provided
        if (changeValue) {
            changeValue({ value: selectedValue, field, fieldKey })
        }
        // Update the Formik field value
        formik.setFieldValue(fieldKey, selectedValue)
    }
    return (
        <Select
            w={`100%`}
            size={'sm'}
            fontSize={'small'}
            background={'white'}
            borderRadius={'0.3rem'}
            isDisabled={field.editable === false}
            placeholder={'Select Option'}
            icon={<AiFillCaretDown fontSize={'14px'} />}
            isInvalid={isInvalid}
            errorBorderColor={'crimson'}
            className={`${!field.editable ? 'mandatory' : ''}`}
            {...formik.getFieldProps(fieldKey)}
            onChange={handleSelectChange}
        >
            {field.options?.filter((option) => !option.hidden)?.length ? (
                field.options
                    .filter((option) => !option.hidden)
                    .map((option) => (
                        <option key={option.key} value={option.key}>
                            {option.display}
                        </option>
                    ))
            ) : (
                <option disabled>No Options Available</option>
            )}
        </Select>
    )
}
