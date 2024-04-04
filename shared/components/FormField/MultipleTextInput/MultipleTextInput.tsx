import { Box, Flex, Icon, Input, Tag, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { RiCloseCircleLine } from 'react-icons/ri'
import { Field } from 'shared/types/forms'

type Props = {
    fieldKey: string
    field: Field<'multi_text_input'>
}

export default function MultipleTextInput({ fieldKey, field }: Props) {
    const formik = useFormikContext()
    const values: string = formik.values?.[fieldKey as keyof typeof formik.values] || ''
    const nestedError = getIn(formik.errors, fieldKey)
    // Access the touched status for the nested field
    const nestedTouched = getIn(formik.touched, fieldKey)
    // Check if the field is touched to determine if it's invalid
    const isInvalid = nestedTouched && nestedError

    const handleRemove = (code: string) => {
        formik.setFieldValue(
            fieldKey,
            values
                .split(',')
                .filter((value) => value !== code)
                .join(','),
        )
    }
    return (
        <>
            <Box w="100%" overflowX="auto" overflowY="auto" maxH="200px">
                {' '}
                {/* Adjust maxH as needed */}
                <Flex flexDirection="row" flexWrap="wrap">
                    {values &&
                        values.split(',').map(
                            (value, index) =>
                                value.trim() && (
                                    <Flex alignItems="center" key={index}>
                                        <Text as="span" p="2">
                                            <Tag>
                                                {value.trim()}
                                                <Icon
                                                    cursor="pointer"
                                                    onClick={() => handleRemove(value)}
                                                    as={RiCloseCircleLine}
                                                    boxSize={5}
                                                />
                                            </Tag>
                                        </Text>
                                    </Flex>
                                ),
                        )}
                </Flex>
            </Box>
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
