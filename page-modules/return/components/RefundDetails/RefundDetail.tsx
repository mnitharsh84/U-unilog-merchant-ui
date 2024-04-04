import { Box, Card, Flex } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { ProductDetail, RefundData, Return } from 'page-modules/return/type/return'
import { useMemo } from 'react'
import FormField from 'shared/components/FormField/FormField'
import * as Yup from 'yup'

type Props = {
    returns: Return[]
    selectedRequestId: string[]
    handleChange: (isValid: boolean, values: { [key: string]: RefundData }) => void
}

const getTotalPrice = (selectedRequestId: string, returns: Return[]) => {
    let totalPrice = 0
    returns.map((groupItem) => {
        groupItem.items.map((product: ProductDetail) => {
            const isChecked = selectedRequestId == product.requestId
            if (isChecked) totalPrice = totalPrice + product.price * product.quantity
        })
    })
    return totalPrice.toString()
}

const createFormIntialValues = (selectedRequestId: string[], returns: Return[]) => {
    const formIntialValues: { [key: string]: any } = {}
    selectedRequestId.forEach((requestId: string) => {
        formIntialValues[requestId] = {
            selectedRequestId: requestId,
            totalAmount: getTotalPrice(requestId, returns),
            approvedAmount: '',
        }
    })
    return formIntialValues
}

type ValidationSchema = Yup.ObjectSchema<{
    [key: string]: Yup.ObjectSchema<{
        selectedRequestId: Yup.StringSchema<string>
        totalAmount: Yup.StringSchema<string>
        approvedAmount: Yup.StringSchema<string>

        // Add other properties as needed
    }>
}>
const createValidationSchema = (selectedRequestId: string[], returns: Return[]): ValidationSchema => {
    const validationSchemaObj: Record<string, Yup.Schema> = {}
    selectedRequestId.forEach((requestId: string) => {
        validationSchemaObj[requestId] = Yup.object().shape({
            selectedRequestId: Yup.string(),
            totalAmount: Yup.string(),
            approvedAmount: Yup.string()
                .required('Approved amount is required')
                .test('is-not-negative', 'Please enter valid approved amount', function (value) {
                    if (!value) return true // Skip validation if value is empty
                    const numericValue = parseFloat(value)
                    return numericValue >= 0
                })
                .test(
                    'is-less-than-total',
                    'Approved amount must be less than or equal to total amount',
                    function (value) {
                        const total = getTotalPrice(requestId, returns)
                        console.log(parseInt(value), parseInt(total), parseInt(value) <= parseInt(total))
                        return parseInt(value) <= parseInt(total)
                    },
                ),
        })
    })

    return Yup.object().shape(validationSchemaObj)
}

const RefundDetail = ({ selectedRequestId, returns, handleChange }: Props) => {
    const getInitialValues = useMemo(() => {
        return createFormIntialValues(selectedRequestId, returns)
    }, [selectedRequestId, returns])

    const getValidationSchema = useMemo(() => {
        console.log('validation', selectedRequestId)
        return createValidationSchema(selectedRequestId, returns)
    }, [selectedRequestId, returns])

    const handleChangeValue = (isValid: boolean, values: { [key: string]: RefundData }) => {
        console.log(values)
        handleChange(!isValid, values)
    }
    return (
        selectedRequestId && (
            <Card p={4}>
                <Formik
                    initialValues={getInitialValues}
                    onSubmit={(values) => {
                        console.log(values)
                    }}
                    validationSchema={getValidationSchema}
                    validate={(values: { [key: string]: any }) => {
                        // Perform any additional validation logic here
                        const isValid = Object.keys(getValidationSchema.fields).every((field: string) => {
                            try {
                                // Use type assertion to index into validationSchema.fields
                                ;(getValidationSchema.fields as { [key: string]: Yup.AnyObjectSchema })[
                                    field
                                ].validateSync(values[field])
                                return true
                            } catch (error) {
                                return false
                            }
                        })

                        // Call the onFormValidityChange function with the current validity
                        handleChangeValue(isValid, values)

                        return {}
                    }}
                    enableReinitialize={true}
                    validateOnMount={true}
                >
                    {({}) => (
                        <Form>
                            <Flex gap={4} flexDir={'column'} alignItems={'flex-start'}>
                                {selectedRequestId &&
                                    selectedRequestId.map((requestId: string, index: number) => (
                                        <>
                                            <Flex
                                                width="100%"
                                                key={`${index}-totalAmount`}
                                                gap="4"
                                                flexDir="row"
                                                justifyContent="space-between"
                                            >
                                                <Box width="40%" fontWeight="bold">
                                                    {`Total Amount : `}
                                                </Box>
                                                <Box width="60%">
                                                    <FormField
                                                        key={`${requestId}.totalAmount`}
                                                        fieldKey={`${requestId}.totalAmount`}
                                                        field={{
                                                            display: 'Total Amount',
                                                            hidden: false,
                                                            type: 'text_input',
                                                            init_value: '',
                                                            placeholder: 'Enter Total Amount',
                                                            required: false,
                                                            editable: false,
                                                        }}
                                                    />
                                                </Box>
                                            </Flex>
                                            <Flex
                                                width="100%"
                                                key={`${index}-approvedAmount`}
                                                gap="4"
                                                flexDir="row"
                                                justifyContent="space-between"
                                            >
                                                <Box width="40%" fontWeight="bold">
                                                    {`Approved Amount : `}
                                                </Box>
                                                <Box width="60%">
                                                    <FormField
                                                        key={`${requestId}.approvedAmount`}
                                                        fieldKey={`${requestId}.approvedAmount`}
                                                        field={{
                                                            display: 'Approved Amount',
                                                            hidden: false,
                                                            type: 'text_input',
                                                            init_value: '',
                                                            placeholder: 'Enter Approved Amount',
                                                            required: true,
                                                            editable: true,
                                                            showErrorMessage: true,
                                                        }}
                                                    />
                                                </Box>
                                            </Flex>
                                        </>
                                    ))}
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Card>
        )
    )
}

export default RefundDetail
