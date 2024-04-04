import { Box, Button, Card, Flex, Grid, Heading, Icon, Text } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import FormField from 'shared/components/FormField/FormField'
import * as Yup from 'yup'

const Approve = ({ info }: any) => {
    const formFields: any[] = [
        {
            key: 'logisticsPartner',
            type: 'select',
            placeHolder: 'Select Logistics Partner',
            display: 'Logistics Partner',
            initValue: '',
            options: [
                {
                    key: 'shippedByCustomer',
                    display: 'shipped by customer',
                },
            ],
            editable: true,
            required: false,
        },
        {
            key: 'warehouseAddress',
            type: 'text_input',
            placeHolder: 'Enter Warehouse Address',
            display: 'Warehouse Address',
            initValue: '',
            editable: true,
            required: false,
        },
    ]
    return (
        <Card>
            <Box p={4}>
                <Heading as="h6" fontSize="md">
                    Choose a logistics partner to approve the request
                </Heading>
                <Text fontSize="xs">Item was shipped from Shop location - ...</Text>
            </Box>

            <Flex p={4} flexDir="column" gap="4">
                <Formik
                    initialValues={{
                        logisticsPartner: '',
                        warehouseAddress: '',
                    }}
                    validationSchema={Yup.object().shape(
                        formFields.reduce((prev, filter) => ({ ...prev, [filter.key]: filter.validation }), {}),
                    )}
                    onSubmit={(values: any, { setSubmitting }) => {
                        // Manually set submitting to false
                        setSubmitting(false)
                    }}
                    enableReinitialize={true}
                    validateOnMount={true}
                >
                    {({ isValid }) => (
                        <Form>
                            <Grid templateColumns={['1fr', 'repeat(2, 1fr)']} columnGap={'1rem'} mt={4}>
                                {formFields.map((field) => {
                                    return (
                                        <Flex
                                            gap={1}
                                            flexDir={'column'}
                                            alignItems={'flex-start'}
                                            mb={4}
                                            key={field.key}
                                            flex={1}
                                        >
                                            <Card p="4" width="100%">
                                                <Text
                                                    as={'span'}
                                                    fontSize={'sm'}
                                                    fontWeight="bold"
                                                    color={'gray.500'}
                                                    textTransform={'capitalize'}
                                                    ps={3}
                                                    pb={3}
                                                    className={`${field.required ? 'required-field' : ''}`}
                                                >
                                                    {field.display}
                                                </Text>
                                                <FormField
                                                    fieldKey={field.key}
                                                    field={{
                                                        display: field.display,
                                                        hidden: false,
                                                        type: field.type,
                                                        init_value: field.initValue,
                                                        placeholder: field.placeHolder,
                                                        required: field.required,
                                                        options: field.options?.map((opt: any) => ({
                                                            key: opt.key,
                                                            display: opt.display,
                                                            hidden: false,
                                                        })),
                                                        editable: field.editable,
                                                        minDate: field.minDate,
                                                    }}
                                                />
                                                <Text
                                                    as={'span'}
                                                    fontSize={'sm'}
                                                    color={'gray.500'}
                                                    textTransform={'capitalize'}
                                                    ps={3}
                                                    pt={3}
                                                >
                                                    {field.extraInfo}
                                                </Text>
                                            </Card>
                                        </Flex>
                                    )
                                })}
                            </Grid>
                            <Flex gap={1} flexDir={'column'} alignItems={'flex-end'} mb={4}>
                                <Button isDisabled={!isValid} size="sm" type="submit">
                                    Approve
                                </Button>
                            </Flex>
                        </Form>
                    )}
                </Formik>
            </Flex>
        </Card>
    )
}

export default Approve
