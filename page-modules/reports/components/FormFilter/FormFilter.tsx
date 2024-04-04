import { Button, Flex, Grid, Text } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { setInitalValue } from 'page-modules/reports/utils'
import FormField from 'shared/components/FormField/FormField'
import { INIT_VALUE_MAP } from 'shared/utils/forms'
import * as Yup from 'yup'

import { Filter } from '../../type/reports'

type handleSubmitProp = (values: { [key: string]: any }) => void

type Props = {
    handleFormSubmit: handleSubmitProp
    filters: Array<Filter>
    filterFormText: string
    isButtonDisabled: boolean
}

export default function FormFilter({ handleFormSubmit, filters, isButtonDisabled = false, filterFormText }: Props) {
    return (
        <>
            <Text fontSize="xs" color="gray.600" mb={1} ps={3}>
                {filterFormText}
            </Text>
            <Formik
                initialValues={setInitalValue(filters)}
                validationSchema={Yup.object().shape(
                    filters.reduce((prev, filter) => ({ ...prev, [filter.key]: filter.validation }), {}),
                )}
                onSubmit={(values, { setSubmitting }) => {
                    handleFormSubmit(values)
                    // Manually set submitting to false
                    setSubmitting(false)
                }}
                enableReinitialize={true}
                validateOnMount={true}
            >
                {({ isValid }) => (
                    <Form>
                        <Grid
                            templateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}
                            columnGap={'1rem'}
                            mt={4}
                        >
                            {filters.map((filter) => {
                                return (
                                    <Flex
                                        gap={1}
                                        flexDir={'column'}
                                        alignItems={'flex-start'}
                                        mb={4}
                                        key={filter.key}
                                        flex={1}
                                    >
                                        <Text
                                            noOfLines={1}
                                            as={'span'}
                                            fontSize={'x-small'}
                                            color={'gray.500'}
                                            textTransform={'capitalize'}
                                            ps={3}
                                            className={`${filter.required ? 'required-field' : ''}`}
                                        >
                                            {filter.display}
                                        </Text>
                                        <FormField
                                            fieldKey={filter.key}
                                            field={{
                                                display: filter.display,
                                                hidden: false,
                                                type: filter.type,
                                                init_value: INIT_VALUE_MAP[filter.type],
                                                placeholder: filter.placeHolder,
                                                required: filter.required,
                                                options: filter.options?.map((opt) => ({
                                                    key: opt.key,
                                                    display: opt.display,
                                                    hidden: false,
                                                })),
                                                editable: filter.editable,
                                                minDate: filter.minDate,
                                                showSelectAll: true,
                                            }}
                                        />
                                    </Flex>
                                )
                            })}
                        </Grid>
                        <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} mb={4}>
                            <Button isDisabled={isButtonDisabled || !isValid} size="sm" type="submit">
                                Download report
                            </Button>
                        </Flex>
                    </Form>
                )}
            </Formik>{' '}
        </>
    )
}
