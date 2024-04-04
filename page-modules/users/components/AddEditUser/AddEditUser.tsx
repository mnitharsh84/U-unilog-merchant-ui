import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import { DoActionParams } from 'page-modules/users/type/users'
import { useEffect } from 'react'
import FormField from 'shared/components/FormField/FormField'
import { formField } from 'shared/types/forms'
import * as Yup from 'yup'

type Props = {
    initialData: any
    doAction: (params: DoActionParams) => any
}

export default function AddEditUser({ initialData, doAction }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const formFields = initialData ? initialData.formFields : []
    useEffect(() => {
        onOpen()
        return () => {
            onClose() // Ensure drawer is closed when component unmounts
        }
    }, [])

    const closeDrawer = () => {
        onClose()
    }

    const handleCancel = () => {
        closeDrawer()
        doAction({ action: 'cancel' })
    }

    const setIntialValue = () => {
        let intialValue: { [key: string]: any } = {} // Specify the object shape
        formFields.map((field: formField) => {
            intialValue[field.key] = field.initValue
        })
        return intialValue
    }

    return (
        <Drawer isOpen={isOpen} onClose={handleCancel} placement="right" size="md">
            <DrawerOverlay />
            <DrawerContent fontSize={'xs'}>
                <DrawerHeader py={3} px={4} bg={`gray.100`} fontSize="md">
                    {initialData.title}
                </DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                    <Formik
                        initialValues={setIntialValue()}
                        validationSchema={Yup.object().shape(
                            formFields.reduce(
                                (prev: any, field: formField) => ({ ...prev, [field.key]: field.validation }),
                                {},
                            ),
                        )}
                        onSubmit={(values) => {
                            doAction({ values, action: initialData.mode, userId: initialData.userId })
                        }}
                        enableReinitialize={true}
                        validateOnMount={true}
                    >
                        {({ isValid }) => (
                            <Form>
                                <Grid templateColumns={'repeat(2, 1fr)'} columnGap={'1rem'} mt={4}>
                                    {formFields.map((data: any) => {
                                        return (
                                            <Flex
                                                gap={1}
                                                flexDir={'column'}
                                                alignItems={'flex-start'}
                                                mb={4}
                                                key={data.key}
                                            >
                                                <Text
                                                    as={'span'}
                                                    fontSize={'x-small'}
                                                    color={'gray.500'}
                                                    textTransform={'capitalize'}
                                                    ps={3}
                                                    className={data.required ? 'required-field' : ''}
                                                >
                                                    {data.display}:
                                                </Text>
                                                <FormField
                                                    fieldKey={data.key}
                                                    field={{
                                                        display: data.display,
                                                        hidden: false,
                                                        type: data.type,
                                                        init_value: data.initValue,
                                                        placeholder: data.placeHolder,
                                                        options: data.options?.map((opt: any) => ({
                                                            key: opt.key,
                                                            display: opt.display,
                                                            hidden: false,
                                                        })),
                                                        editable: data.editable,
                                                        minDate: data.minDate,
                                                        showErrorMessage: data.showErrorMessage,
                                                    }}
                                                />
                                            </Flex>
                                        )
                                    })}
                                </Grid>

                                <Flex justify="flex-end" mt={4} w={`100%`} justifyContent="space-between" gap={4}>
                                    <Button
                                        bg={`white`}
                                        variant={'outline'}
                                        onClick={handleCancel}
                                        size={'xs'}
                                        h={`28px`}
                                        w={`100%`}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme={'teal'}
                                        size={'xs'}
                                        h={`28px`}
                                        type={'submit'}
                                        isDisabled={!isValid}
                                        w={`100%`}
                                    >
                                        {initialData.mode}
                                    </Button>
                                </Flex>
                            </Form>
                        )}
                    </Formik>
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}
