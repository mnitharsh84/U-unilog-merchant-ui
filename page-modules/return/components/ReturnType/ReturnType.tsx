import { Flex } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import FormField from 'shared/components/FormField/FormField'
import { formField } from 'shared/types/forms'
import * as Yup from 'yup'

const SelectReturnType = ({ onInputChange, initialValues, formFields }: any) => {
    // State to hold the input value

    // Event handler for input change
    const handleChangeValue = (isFormValid: boolean, values: { [key: string]: string }) => {
        onInputChange(isFormValid, values)
    }

    const validationSchema = Yup.object().shape(
        formFields.reduce((prev: any, filter: any) => ({ ...prev, [filter.key]: filter.validation }), {}),
    )

    return (
        <Flex flexDir="column" gap="4">
            <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                    console.log(values)
                }}
                validationSchema={validationSchema}
                validate={(values: { [key: string]: any }) => {
                    // Perform any additional validation logic here
                    const isValid = Object.keys(validationSchema.fields).every((field: string) => {
                        try {
                            // Use type assertion to index into validationSchema.fields
                            ;(validationSchema.fields as { [key: string]: Yup.AnyObjectSchema })[field].validateSync(
                                values[field],
                            )
                            return true
                        } catch (error) {
                            return false
                        }
                    })

                    // Call the onFormValidityChange function with the current validity
                    handleChangeValue(isValid, values)

                    return {}
                }}
            >
                {({}) => (
                    <Form>
                        <Flex gap={4} flexDir={'column'} alignItems={'flex-start'} flex={1}>
                            {formFields &&
                                formFields.map((field: formField) => (
                                    <FormField
                                        key={field.key}
                                        fieldKey={field.key}
                                        field={{
                                            display: field.display,
                                            hidden: false,
                                            type: field.type,
                                            init_value: field.initValue,
                                            placeholder: field.placeHolder,
                                            required: field.required,
                                            editable: field.editable,
                                            options: field.options?.map((opt) => ({
                                                key: opt.key,
                                                display: opt.display,
                                                hidden: false,
                                            })),
                                        }}
                                    />
                                ))}
                        </Flex>
                    </Form>
                )}
            </Formik>
        </Flex>
    )
}

export default SelectReturnType
