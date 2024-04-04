import { Box, Divider } from '@chakra-ui/react'
import { Form, Formik, FormikProps } from 'formik'
import { forwardRef } from 'react'
import FormField from 'shared/components/NewFormField/FormField'
import { getField, getInitialValues, getValidationSchema } from 'shared/utils/form'
import * as Yup from 'yup'

import { WarehouseData } from '../types/warehouse'
import styles from './Warehouse.module.scss'

type Props = {
    warehouseData?: WarehouseData
}

function getInitialValue(areAllSkusFulfillable: boolean | undefined) {
    if (areAllSkusFulfillable === true) return 'YES'
    if (areAllSkusFulfillable === false) return 'NO'

    return 'YES'
}

const ServiceabilityCard = forwardRef<FormikProps<Record<string, unknown>>, Props>(function ServiceabilityCard(
    { warehouseData },
    ref,
) {
    const fields = [
        getField<'select'>({
            fieldKey: 'areAllSkusFulfillable',
            display: 'Are All SKUs Fulfillable',
            hidden: false,
            type: 'select',
            init_value: getInitialValue(warehouseData?.areAllSkusFulfillable),
            arguments: {
                options: [
                    { display: 'Yes', key: 'YES', hidden: false },
                    { display: 'No (Fulfillment Import data to be considered)', key: 'NO', hidden: false },
                ],
            },
            validationSchema: Yup.string().required('Warehouse status is required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'serviceable_type',
            display: 'Restricted to pincodes',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.serviceable_type ?? '',
            arguments: {
                options: [
                    { display: 'All', key: 'TO_ALL', hidden: false },
                    { display: 'Selected', key: 'TO_SELECTED', hidden: false },
                    { display: 'All Except Selected', key: 'TO_ALL_EXCEPT_SELECTED', hidden: false },
                ],
            },
            validationSchema: Yup.string()
                .required('Serviceability is required')
                .oneOf(['TO_ALL', 'TO_SELECTED', 'TO_ALL_EXCEPT_SELECTED'], 'Invalid serviceability selected'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'selected_pincodes',
            display: 'Selected Pincodes',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.selected_pincodes ?? '',
            placeholder: 'Enter comma-separated values. eg: 123456,234561',
            arguments: {},
            validationSchema: Yup.string()
                .when('serviceable_type', {
                    is: (serviceable_type: string) =>
                        serviceable_type === 'TO_SELECTED' || serviceable_type === 'TO_ALL_EXCEPT_SELECTED',
                    then: (schema) =>
                        schema
                            .required('Pincodes are required')
                            .matches(/^(?:\d{6},)*\d{6}$/, 'Invalid format. Use comma-separated numbers of length 6'),
                })
                .matches(
                    /^(?:\d{6},)*\d{6}$/,
                    'Invalid format. Use comma-separated numbers of length 6 with no leading or trailing spaces.',
                ),
            showErrorMessage: true,
        }),
    ]

    const initialValues = getInitialValues(fields)
    const validationSchema = getValidationSchema(fields)

    return (
        <Box mb={4}>
            <Divider />
            <Formik
                innerRef={ref}
                initialValues={initialValues}
                enableReinitialize={true}
                validationSchema={validationSchema}
                validateOnMount={true}
                onSubmit={() => void 0}
            >
                {({ values }) => (
                    <Form>
                        <Box className={styles.serviceabilityContainer}>
                            {fields.map((field) => {
                                if (
                                    field.fieldKey === 'serviceable_type' ||
                                    field.fieldKey === 'areAllSkusFulfillable' ||
                                    values.serviceable_type === 'TO_SELECTED' ||
                                    values.serviceable_type === 'TO_ALL_EXCEPT_SELECTED'
                                )
                                    return <FormField key={field.fieldKey} field={field} />
                            })}
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    )
})

export default ServiceabilityCard
