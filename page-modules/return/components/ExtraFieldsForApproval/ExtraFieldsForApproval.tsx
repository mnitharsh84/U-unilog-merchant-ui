import { Flex, Grid } from '@chakra-ui/react'
import { FetchShippingProvidersType } from 'apis/get'
import { GetWarehouseListResponse } from 'apis/manifest/get'
import { Form, Formik } from 'formik'
import { WarehouseData } from 'page-modules/manifest/warehouse/types/warehouse'
import { ApproveManualFields } from 'page-modules/return/config/config'
import { useShippingProviders, useWarehouseList } from 'page-modules/return/hooks/queries'
import { ManualApprovalData } from 'page-modules/return/type/return'
import { useState } from 'react'
import FormField from 'shared/components/NewFormField/FormField'
import { Field } from 'shared/types/form'
import { getValidationSchema } from 'shared/utils/form'

type Params = {
    handleChange: (isValid: boolean, values: ManualApprovalData) => void
}
export const ExtraFieldsForApproval = ({ handleChange }: Params) => {
    const [formFields, setFormFields] = useState(ApproveManualFields)
    const { data } = useShippingProviders()
    const { data: facilityData } = useWarehouseList()

    const facilityCodeField = formFields.find((field) => field.fieldKey === 'facilityCode') as Field<'select'>
    const shippingProviderCodeField = formFields.find(
        (field) => field.fieldKey === 'shippingProviderCode',
    ) as Field<'select'>

    const onFacilityListRetrieve = (data: GetWarehouseListResponse) => {
        setFormFields((formFields) => {
            const _formFields = [...formFields]
            const _facilityCodeField = _formFields.find((field) => field.fieldKey === 'facilityCode') as Field<'select'>

            const shippingProviderList = data.warehouseList.map((facility: WarehouseData) => {
                return {
                    key: facility.warehouse_code,
                    display: facility.name,
                    hidden: false,
                }
            })
            _facilityCodeField.arguments.options = shippingProviderList

            return _formFields
        })
    }
    if (facilityData && facilityCodeField) {
        if (!facilityCodeField.arguments.options.length) onFacilityListRetrieve(facilityData)
    }

    const onShippingProviderListRetrieve = (shippingProviders: FetchShippingProvidersType) => {
        setFormFields((formFields) => {
            const _formFields = [...formFields]
            const _shippingProviderCodeField = _formFields.find(
                (field) => field.fieldKey === 'shippingProviderCode',
            ) as Field<'select'>

            const shippingProviderList = shippingProviders.data.map((shippingProvider) => {
                return {
                    key: shippingProvider.key,
                    display: shippingProvider.name,
                    hidden: false,
                }
            })
            _shippingProviderCodeField.arguments.options = shippingProviderList
            return _formFields
        })
    }
    if (data && shippingProviderCodeField) {
        if (!shippingProviderCodeField.arguments.options.length) onShippingProviderListRetrieve(data)
    }

    const validationSchema = getValidationSchema(formFields)
    const intialData: ManualApprovalData = {
        trackingNumber: '',
        shippingProviderCode: '',
        facilityCode: '',
    }

    const handleChangeValue = (isValid: boolean, values: ManualApprovalData) => {
        handleChange(!isValid, values)
    }
    return (
        <Formik
            initialValues={intialData}
            validationSchema={validationSchema}
            validate={(values: ManualApprovalData) => {
                const isValid = Object.keys(values).every((fieldKey: string) => {
                    try {
                        validationSchema.validateSyncAt(fieldKey, values)
                        return true
                    } catch (error) {
                        return false
                    }
                })

                handleChangeValue(isValid, values)
                return {}
            }}
            onSubmit={() => {
                return
            }}
            enableReinitialize={true}
            validateOnMount={true}
        >
            {({}) => (
                <Form>
                    <Grid templateColumns={['1fr', 'repeat(2, 1fr)']} columnGap={'1rem'}>
                        {formFields.map((field) => (
                            <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} key={field.fieldKey} flex={1}>
                                <FormField key={field.fieldKey} field={field} />
                            </Flex>
                        ))}
                    </Grid>
                </Form>
            )}
        </Formik>
    )
}
