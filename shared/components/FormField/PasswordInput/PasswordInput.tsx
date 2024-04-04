import { IconButton, Input, InputGroup, InputRightElement, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Field } from 'shared/types/forms'

type Props = {
    fieldKey: string
    field: Field<'password_input'>
}

export default function PasswordInput({ fieldKey, field }: Props) {
    const formik = useFormikContext()
    const nestedError = getIn(formik.errors, fieldKey)
    const nestedTouched = getIn(formik.touched, fieldKey)
    const isInvalid = nestedTouched && nestedError

    const [showPassword, setShowPassword] = useState(false)

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState)
    }

    return (
        <>
            <InputGroup size={'sm'} width={'100%'} mb={3}>
                <Input
                    pr={'2.5rem'}
                    type={showPassword ? 'text' : 'password'}
                    size={'sm'}
                    fontSize={'small'}
                    background={'white'}
                    borderRadius={'0.3rem'}
                    placeholder={field.placeholder ?? 'Enter password'}
                    isDisabled={field.editable === false}
                    isInvalid={isInvalid}
                    errorBorderColor={'crimson'}
                    {...formik.getFieldProps(fieldKey)}
                    className={`${!field.editable ? 'mandatory' : ''}`}
                />
                <InputRightElement width={'2.5rem'} mt={'0.2rem'}>
                    <IconButton
                        aria-label={showPassword ? 'Hide Password' : 'Show Password'}
                        icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                        size={'xs'}
                        onClick={togglePasswordVisibility}
                    />
                </InputRightElement>
            </InputGroup>
            {field.showErrorMessage && (
                <Text fontSize={'x-small'} color="crimson">
                    {isInvalid}
                </Text>
            )}
        </>
    )
}
