import { Box, Text } from '@chakra-ui/react'
import { Form, Formik, FormikProps } from 'formik'
import { forwardRef } from 'react'
import FormField from 'shared/components/NewFormField/FormField'
import { getField, getInitialValues, getValidationSchema } from 'shared/utils/form'
import * as Yup from 'yup'

import { WarehouseData } from '../types/warehouse'
import { STATE_CODE_OPTIONS } from '../utils'
import styles from './Warehouse.module.scss'

type Props = {
    warehouseData?: WarehouseData
}

function getInitialValue(isEnabled: boolean | undefined) {
    if (isEnabled === true) return 'YES'
    if (isEnabled === false) return 'NO'

    return 'YES'
}

const WarehouseCard = forwardRef<FormikProps<Record<string, unknown>>, Props>(function WarehouseCard(
    { warehouseData },
    ref,
) {
    const fields = [
        getField<'text_input'>({
            fieldKey: 'name',
            display: 'Name',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.name ?? '',
            arguments: {},
            validationSchema: Yup.string().required('Warehouse name is required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'warehouse_code',
            display: 'Code',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.warehouse_code ?? '',
            arguments: {},
            validationSchema: Yup.string().required('Warehouse code is required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'address_line_1',
            display: 'Address Line 1',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.address_line_1 ?? '',
            arguments: {},
            validationSchema: Yup.string().required('Address is required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'address_line_2',
            display: 'Address Line 2',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.address_line_2 ?? '',
            arguments: {},
            validationSchema: Yup.string(),
            showErrorMessage: true,
            required: false,
        }),
        getField<'text_input'>({
            fieldKey: 'city',
            display: 'City',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.city ?? '',
            arguments: {},
            validationSchema: Yup.string().required('City is required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'state_code',
            display: 'State',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.state_code ?? '',
            arguments: { options: STATE_CODE_OPTIONS },
            validationSchema: Yup.string().required('State is required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'country_code',
            display: 'Country',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.country_code ?? 'IND',
            arguments: { options: [{ display: 'India', key: 'IND', hidden: false }] },
            validationSchema: Yup.string().required('Country is required'),
            showErrorMessage: true,
            editable: false,
        }),
        getField<'text_input'>({
            fieldKey: 'pincode',
            display: 'Pincode',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.pincode ?? '',
            arguments: {},
            validationSchema: Yup.string()
                .matches(/^[0-9]{6}$/, 'Must be a 6-digit number')
                .required('Required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'gstin',
            display: 'GST Number',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.gstin ?? '',
            arguments: {},
            validationSchema: Yup.string()
                .matches(/^[0-9]{15}$/, 'Must be a 15-digit number')
                .required('Required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'enabled',
            display: 'Enabled',
            hidden: false,
            type: 'select',
            init_value: getInitialValue(warehouseData?.enabled),
            arguments: {
                options: [
                    { display: 'Yes', key: 'YES', hidden: false },
                    { display: 'No', key: 'NO', hidden: false },
                ],
            },
            validationSchema: Yup.string().required('Warehouse status is required'),
            showErrorMessage: true,
        }),
        getField<'select'>({
            fieldKey: 'oms_code',
            display: 'OMS Code',
            hidden: false,
            type: 'select',
            init_value: warehouseData?.oms_code ?? 'UNIWARE',
            arguments: {
                options: [{ display: 'Uniware', key: 'UNIWARE', hidden: false }],
            },
            validationSchema: Yup.string().required('OMS code is required'),
            showErrorMessage: true,
            editable: false,
        }),
        getField<'text_input'>({
            fieldKey: 'phone',
            display: 'Phone',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.phone ?? '',
            arguments: {},
            validationSchema: Yup.string()
                .matches(/^[0-9]{10}$/, 'Must be a 10-digit number')
                .required('Required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'email',
            display: 'Email',
            hidden: false,
            type: 'text_input',
            init_value: warehouseData?.email ?? '',
            arguments: {},
            validationSchema: Yup.string().email('Invalid email address').required('Email is required'),
            showErrorMessage: true,
        }),
    ]

    const initialValues = getInitialValues(fields)

    const validationSchema = getValidationSchema(fields)

    return (
        <Box mb={4}>
            <Text fontSize={'medium'} fontWeight={'bold'}>
                Warehouse Details
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

export default WarehouseCard
