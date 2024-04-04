import { Box, Button } from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { Dispatch, SetStateAction } from 'react'
import FormField from 'shared/components/NewFormField/FormField'
import { getField, getInitialValues, getValidationSchema } from 'shared/utils/form'
import * as Yup from 'yup'

import { useMutateCalculateEDD } from '../hooks/mutations'
import { CalculateEDDPayload, EDD } from '../types'
import styles from './EddCalculator.module.scss'

type Props = {
    setEddList: Dispatch<SetStateAction<EDD[] | null>>
}
export default function Calculator({ setEddList }: Props) {
    const fields = [
        getField<'text_input'>({
            fieldKey: 'pincode',
            display: 'Destination Pincode',
            hidden: false,
            type: 'text_input',
            init_value: '',
            arguments: {},
            validationSchema: Yup.string()
                .matches(/^[0-9]{6}$/, 'Must be a 6-digit number')
                .required('Required'),
            showErrorMessage: true,
        }),
        getField<'text_input'>({
            fieldKey: 'sku',
            display: 'SKU',
            hidden: false,
            type: 'text_input',
            init_value: '',
            arguments: {},
            validationSchema: Yup.string().required('Required'),
            showErrorMessage: true,
        }),
    ]

    const initialValues = getInitialValues(fields)

    const validationSchema = getValidationSchema(fields)

    const mutation = useMutateCalculateEDD()

    return (
        <Box mb={6}>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnMount={true}
                onSubmit={async (values) => {
                    const data = await mutation.mutateAsync(values as CalculateEDDPayload)
                    setEddList(data)
                }}
            >
                {({ isSubmitting, isValid }) => (
                    <Form>
                        <Box className={styles.container}>
                            {fields.map((field) => (
                                <FormField key={field.fieldKey} field={field} />
                            ))}
                        </Box>

                        <Button
                            colorScheme={'teal'}
                            size={'sm'}
                            mt={4}
                            w={'min(300px, 100%)'}
                            type={'submit'}
                            isLoading={isSubmitting}
                            isDisabled={!isValid}
                        >
                            Calculate
                        </Button>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}
