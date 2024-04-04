import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Button, Card, Center, Flex, Grid, Text, Tooltip } from '@chakra-ui/react'
import { useQueryClient } from '@tanstack/react-query'
// Import the InfoOutlineIcon
import { Form, Formik } from 'formik'
import { FieldExtraInfo, SetUpFormFields, SetupFormInitialValue } from 'page-modules/return/config/config'
import { UseMutationSetupPolicy } from 'page-modules/return/hooks/mutations'
import { useRmsReturnPolicyData } from 'page-modules/return/hooks/queries'
import { KeyboardEventHandler, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormField from 'shared/components/FormField/FormField'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { SelectOption } from 'shared/types/form'
import { dateRange } from 'shared/types/forms'
import { convertDateToString, isDateRange } from 'shared/utils/functions'
import * as Yup from 'yup'

import {
    DateFieldType,
    ExclusiveCatalogs,
    FormData,
    SetupPolicy,
    SetupPolicyDetail,
    SetupPolicyPayload,
} from './type/setup'

const columnTypeMapping: { [key: string]: string } = {
    rms_day_window_calculate: 'STRING',
    return_window_in_days: 'NUMBER',
    rms_restriction_period: 'DATE',
    multiple_item_returns_enabled: 'BOOLEAN',
    return_fee_enabled: 'BOOLEAN',
    return_fee: 'NUMBER',
    rms_restriction_period_end_date: 'DATE',
    rms_restriction_period_start_date: 'DATE',
    exclusive_catalogs: 'ExclusiveCatalogs',
}

const dateFieldMapping: { [key: string]: DateFieldType } = {
    rms_restriction_period: {
        startDate: {
            key: 'rms_restriction_period_start_date',
        },
        endDate: {
            key: 'rms_restriction_period_end_date',
        },
    },
}

export default function Setup() {
    const formFields = SetUpFormFields
    const [initialData, setInitialData] = useState<{ [key: string]: string }>(SetupFormInitialValue)
    const setupPolicyApiUrl = 'session/api/v1/rms/setup-policy'
    const handleQuerySuccess = (data: SetupPolicy) => {
        if (data.details) {
            const formFields = setFormFieldInitialValues(data.details)
            const initialValues: { [key: string]: string } = {} // Define the type of initialValues
            formFields.map((fields: any) => {
                initialValues[fields.fieldKey] = fields.init_value
            })
            setInitialData({ ...initialValues })
        }
    }
    const { isLoading, isError } = useRmsReturnPolicyData(setupPolicyApiUrl, handleQuerySuccess)
    const queryClient = useQueryClient()

    const setFormFieldInitialValues = (policyDetails: SetupPolicyDetail) => {
        formFields.forEach((formField) => {
            if (columnTypeMapping[formField.fieldKey] === 'DATE' && dateFieldMapping[formField.fieldKey]) {
                const startDateKey = dateFieldMapping[formField.fieldKey].startDate.key
                const endDateKey = dateFieldMapping[formField.fieldKey].endDate.key

                const initValue: dateRange = { startDate: null, endDate: null }
                if (policyDetails[startDateKey as keyof SetupPolicyDetail]) {
                    initValue['startDate'] = new Date(policyDetails[startDateKey as keyof SetupPolicyDetail] as string)
                }
                if (policyDetails[endDateKey as keyof SetupPolicyDetail]) {
                    initValue['endDate'] = new Date(policyDetails[endDateKey as keyof SetupPolicyDetail] as string)
                }
                formField.init_value = initValue
            } else if (columnTypeMapping[formField.fieldKey] === 'BOOLEAN') {
                formField.init_value =
                    policyDetails[formField.fieldKey as keyof SetupPolicyDetail] === true ? 'true' : 'false'
            } else if (columnTypeMapping[formField.fieldKey] === 'NUMBER') {
                formField.init_value =
                    policyDetails[formField.fieldKey as keyof SetupPolicyDetail] ||
                    policyDetails[formField.fieldKey as keyof SetupPolicyDetail] === 0
                        ? policyDetails[formField.fieldKey as keyof SetupPolicyDetail]
                        : formField.init_value
            } else if (columnTypeMapping[formField.fieldKey] === 'ExclusiveCatalogs') {
                // formField.initValue = policyDetails[formField.key]
                let values: string[] = []
                policyDetails['exclusive_catalogs'].forEach((product: ExclusiveCatalogs) => {
                    values = [...values, product.code]
                })
                formField.init_value = values.length ? values.join(',') : formField.init_value
            } else {
                formField.init_value = policyDetails[formField.fieldKey as keyof SetupPolicyDetail]
                    ? policyDetails[formField.fieldKey as keyof SetupPolicyDetail]
                    : formField.init_value
            }
        })
        return formFields
    }

    const mutation = UseMutationSetupPolicy(setupPolicyApiUrl)
    const createPayload = (formData: FormData) => {
        const payload: any = {}
        for (const key in formData) {
            if (columnTypeMapping[key] === 'DATE') {
                const values: any = formData[key as keyof FormData]
                if (isDateRange(values)) {
                    let start = values.startDate ? convertDateToString(values.startDate) : null
                    let end = values.endDate ? convertDateToString(values.endDate) : null
                    const startDateKey = `${key}_start_date` as keyof SetupPolicyPayload
                    const endDateKey = `${key}_end_date` as keyof SetupPolicyPayload
                    if (start && end) {
                        payload[startDateKey] = start
                        payload[endDateKey] = end
                    } else {
                        start = '1970-01-01'
                        end = start
                        payload[startDateKey] = start
                        payload[endDateKey] = end
                    }
                }
            } else if (columnTypeMapping[key] === 'BOOLEAN') {
                payload[key] = formData[key as keyof FormData] === 'true' ? true : false
            } else if (columnTypeMapping[key] === 'NUMBER') {
                payload[key] = Number(formData[key as keyof FormData])
            } else if (columnTypeMapping[key] === 'ExclusiveCatalogs') {
                payload[key] = formData[key as keyof FormData]
                    .toString()
                    .split(',')
                    .filter((val) => val.trim())
                    .map((val) => val.trim())
            } else {
                payload[key] = formData[key as keyof FormData]
            }
        }
        return { details: payload }
    }

    const handleFormSubmit = (formData: FormData) => {
        const payload = createPayload(formData)
        mutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.data && data.data.successful) {
                    toast.success(data.data.message)
                } else if (data) {
                    toast.success('Return policy updated successfully!')
                } else {
                    toast.error('Return policy not updated.')
                }
                queryClient.invalidateQueries(['get-rms-return-policy'])
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
                queryClient.invalidateQueries(['get-rms-return-policy'])
            },
        })
    }
    const onKeyDown: KeyboardEventHandler<HTMLFormElement> = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
        }
    }

    if (isLoading)
        return (
            <Flex flexDir="column" justifyContent="space-between" h={`100%`} overflow="auto" p="4">
                <FormSkelton rows="2" columns="4" colWidth="200" />
            </Flex>
        )

    if (isError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )
    return (
        <Formik
            initialValues={initialData}
            validationSchema={Yup.object().shape(
                formFields.reduce((prev, filter) => ({ ...prev, [filter.fieldKey]: filter.validationSchema }), {}),
            )}
            onSubmit={(values: any, { setSubmitting }) => {
                handleFormSubmit(values)
                setSubmitting(false)
            }}
            enableReinitialize={true}
            validateOnMount={true}
        >
            {({ isValid }) => (
                <Form onKeyDown={onKeyDown}>
                    <Grid templateColumns={{ lg: '1fr 1fr' }} columnGap={'1rem'} rowGap={4} mt={4}>
                        {formFields.map((field) => {
                            return (
                                <Flex
                                    gap={1}
                                    flexDir={'column'}
                                    alignItems={'flex-start'}
                                    key={field.fieldKey}
                                    h={'100%'}
                                >
                                    <Card p="4" w={'100%'} h={'100%'}>
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
                                            {FieldExtraInfo[field.fieldKey] && FieldExtraInfo[field.fieldKey].info ? (
                                                <Tooltip label={FieldExtraInfo[field.fieldKey].info} hasArrow>
                                                    <InfoOutlineIcon color="gray.400" ml={1} />
                                                </Tooltip>
                                            ) : null}
                                        </Text>
                                        <FormField
                                            fieldKey={field.fieldKey}
                                            field={{
                                                display: field.display,
                                                hidden: false,
                                                type: field.type,
                                                init_value: field.init_value,
                                                placeholder: field.placeholder,
                                                required: field.required,
                                                options: field.arguments.options?.map((opt: SelectOption) => ({
                                                    key: opt.key,
                                                    display: opt.display,
                                                    hidden: false,
                                                })),
                                                editable: field.editable,
                                            }}
                                        />
                                        {FieldExtraInfo[field.fieldKey] && FieldExtraInfo[field.fieldKey].extraInfo ? (
                                            <Text as={'span'} fontSize={'sm'} color={'gray.500'} ps={3} pt={3}>
                                                {FieldExtraInfo[field.fieldKey].extraInfo}
                                            </Text>
                                        ) : null}
                                    </Card>
                                </Flex>
                            )
                        })}
                    </Grid>
                    <Flex gap={1} flexDir={'column'} alignItems={'flex-end'} mb={4}>
                        <Button isDisabled={!isValid} size="sm" type="submit">
                            Save
                        </Button>
                    </Flex>
                </Form>
            )}
        </Formik>
    )
}
