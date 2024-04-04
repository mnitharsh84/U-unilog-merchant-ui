import { Box, Text } from '@chakra-ui/react'
import { Form, Formik, FormikProps } from 'formik'
import { forwardRef } from 'react'
import FormField from 'shared/components/NewFormField/FormField'
import { getField, getInitialValues, getValidationSchema } from 'shared/utils/form'
import * as Yup from 'yup'

import { WarehouseData } from '../types/warehouse'
import { CUT_OFF_TIME_OPTIONS } from '../utils'
import styles from './Warehouse.module.scss'

type Props = {
    warehouseData?: WarehouseData
}
const SLAConfigurationCard = forwardRef<FormikProps<Record<string, unknown>>, Props>(function SLAConfigurationCard(
    { warehouseData },
    ref,
) {
    const fields = [
        getField<'text_input'>({
            fieldKey: 'process_time_value',
            display: 'Processing Time',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.process_time_value ?? '',
            arguments: {},
            validationSchema: Yup.string()
                .required('Processing time is required')
                .matches(/^[0-9]+$/, 'Must be a valid number'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'buffer_time',
            display: 'Buffer Time',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.buffer_time ?? '',
            arguments: {},
            validationSchema: Yup.string()
                .required('Buffer time is required')
                .matches(/^[0-9]+$/, 'Must be a valid number'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'process_time_unit',
            display: 'Processing & Buffer Time Unit',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.process_time_unit ?? '',
            arguments: {
                options: [
                    { display: 'Days', key: 'DAYS', hidden: false },
                    { display: 'Hours', key: 'HOURS', hidden: false },
                ],
            },
            validationSchema: Yup.string().required('Unit is required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'cut_off_time',
            display: 'Cut Off Time',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.cut_off_time ?? '',
            arguments: { options: CUT_OFF_TIME_OPTIONS },
            placeholder: 'Select cut off time',
            validationSchema: Yup.string()
                .required('Cut off time is required')
                .matches(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format. Use HH:MM in 24-hour clock format'),
            showErrorMessage: true,
        }),
    ]

    const initialValues = getInitialValues(fields)
    const validationSchema = getValidationSchema(fields)
    return (
        <Box mb={4}>
            <Text fontSize={'medium'} fontWeight={'bold'}>
                SLA Configuration
            </Text>
            <Formik
                innerRef={ref}
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={true}
                onSubmit={() => void 0}
            >
                <Form>
                    <Box className={styles.container}>
                        {fields.map((field) => (
                            <FormField key={field.fieldKey} field={field} />
                        ))}
                    </Box>
                </Form>
            </Formik>
        </Box>
    )
})

export default SLAConfigurationCard
