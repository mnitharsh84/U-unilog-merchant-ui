import {
    Box,
    Button,
    Card,
    Center,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getRmsReason } from 'apis/get'
import { RMS_REASON_API } from 'apis/url'
import { Form, Formik } from 'formik'
import { RETURN_ACTION } from 'page-modules/return/config/config'
import {
    ConvertExchangePayload,
    ConvertToExchangeFormValues,
    ExchangeReasonData,
    ProductDetail,
    Return,
} from 'page-modules/return/type/return'
import { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from 'shared/components/ConfirmDialog/ConfirmDialog'
import CustomAlertDialog from 'shared/components/CustomAlertDialog/CustomAlertDialog'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import * as Yup from 'yup'

import ProductInfoContainer from '../ProductInfoWrapper/ProductInfoWrapper'

type Props = {
    returns: Return[]
    doAction: (params: { action: string; payload?: ConvertExchangePayload }) => any
    actionType: string[]
    requestId: string
}

const createBundleItemsAndSingleItemsObject = (returns: Return[]) => {
    const returnItems: { [key: string]: ProductDetail[] } = {}
    returns.forEach((returnItem) => {
        returnItem.items.forEach((item) => {
            const key = item.bundle_identifier ? item.bundle_identifier : item.skuCode
            if (returnItems[key]) returnItems[key].push(item)
            else returnItems[key] = [item]
        })
    })
    return returnItems
}

const createFormIntialValues = (returnItems: { [key: string]: ProductDetail[] }) => {
    const formIntialValues: ConvertToExchangeFormValues = {}
    Object.keys(returnItems).forEach((key) => {
        formIntialValues[key] = {
            exchangeReasonId: '',
            exchangeSubReasonId: '',
            skuCode: returnItems[key][0].skuCode,
            bundleSkuCode: returnItems[key][0].bundleSkuCode,
        }
    })
    return formIntialValues
}
type ValidationSchema = Yup.ObjectSchema<{
    [key: string]: Yup.ObjectSchema<{
        exchangeReasonId: Yup.StringSchema<string>
        exchangeSubReasonId?: Yup.StringSchema<string>
        // Add other properties as needed
    }>
}>
const createValidationSchema = (returnItems: { [key: string]: ProductDetail[] }): ValidationSchema => {
    const validationSchemaObj: Record<string, Yup.Schema> = {}

    Object.keys(returnItems).forEach((key) => {
        validationSchemaObj[key] = Yup.object().shape({
            exchangeReasonId: Yup.string().required('Reason is required'),
            exchangeSubReasonId: Yup.string(),
        })
    })

    return Yup.object().shape(validationSchemaObj)
}

const ConvertToExchange = ({ returns, doAction, actionType, requestId }: Props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [isConfirmationOpen, setConfirmationOpen] = useState(false)
    const [formValues, setFormValues] = useState<ConvertExchangePayload>({} as ConvertExchangePayload)
    const [isFormValid, setIsFormValid] = useState<boolean>()
    const {
        isLoading,
        isError,
        data: reasons,
    } = useQuery({
        queryKey: ['get-rms-reason'],
        queryFn: () => getRmsReason(`${RMS_REASON_API}?rms_type=EXCHANGE`),
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })

    const returnItems = createBundleItemsAndSingleItemsObject(returns)
    const initialValues = createFormIntialValues(returnItems)

    const getValidationSchema = useMemo(() => createValidationSchema(returnItems), [returnItems])

    const handleCancel = () => {
        onClose()
        doAction({ action: 'cancel' })
    }

    const handleSubmit = (values: { [key: string]: ExchangeReasonData }) => {
        setFormValues((previousFormValues) => {
            const reasonData = []
            for (const key in values) {
                const returnItem = values[key]
                // Filter out empty properties
                const cleanedReturnItem: ExchangeReasonData = {
                    skuCode: returnItem.skuCode,
                    bundleSkuCode: returnItem.bundleSkuCode,
                    exchangeReasonId: returnItem.exchangeReasonId,
                }
                if (returnItem.exchangeSubReasonId) {
                    cleanedReturnItem['exchangeSubReasonId'] = returnItem.exchangeSubReasonId
                }

                reasonData.push(cleanedReturnItem)
            }
            const newFormValues = { ...previousFormValues, returnRequestId: requestId, reasonData: reasonData }
            return newFormValues
        })
        handleOpenConfirmation()
    }
    useEffect(() => {
        onOpen()
        return () => {
            onClose() // Ensure drawer is closed when component unmounts
        }
    }, [])

    const handleOpenConfirmation = () => {
        // Open the confirmation dialog
        setConfirmationOpen(true)
    }

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false)
    }

    const handleConfirmClick = () => {
        setConfirmationOpen(false)
        onClose()
        doAction({
            action: actionType[0],
            payload: formValues,
        })
    }

    const handleFormValuesChange = (isFormValid: boolean, values: { [key: string]: string }) => {
        // Set the input value in the parent component
        setFormValues((previousFormValues) => {
            const newFormValues = { ...previousFormValues, remark: values.remark }
            return newFormValues
        })
        setIsFormValid(isFormValid)
    }

    if (isLoading)
        return (
            <Flex flexDir="column" justifyContent="space-between" h={`100%`} overflow="scroll" p="4">
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
        <>
            <Drawer isOpen={isOpen} onClose={handleCancel} placement="right" size="lg">
                <DrawerOverlay />
                <DrawerContent fontSize={'xs'}>
                    <DrawerHeader py={3} px={4} bg={`gray.100`} fontSize="md">
                        Convert to Exchange
                    </DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Flex gap="4" flexDir="column">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={getValidationSchema}
                                onSubmit={(values: any) => {
                                    handleSubmit(values)
                                    // Manually set submitting to false
                                }}
                            >
                                {({ isValid }) => (
                                    <Form>
                                        {returnItems &&
                                            Object.keys(returnItems).map((keyy, outerIndex) => (
                                                <Card p={4} key={outerIndex} mt={`${outerIndex > 0 ? 4 : 0}`}>
                                                    <Flex gap="4" flexDir="column">
                                                        {outerIndex === 0 && (
                                                            <>
                                                                <Flex flex="1" gap="4" flexDir="row">
                                                                    <Box flex="1" fontWeight="bold">
                                                                        Product
                                                                    </Box>
                                                                    <Box pl={3} flex="1" fontWeight="bold">
                                                                        Exchange Reason
                                                                    </Box>
                                                                </Flex>
                                                                <Divider bg="gray.200" />
                                                            </>
                                                        )}

                                                        <ProductInfoContainer
                                                            items={returnItems[keyy]}
                                                            parentFieldKey={keyy}
                                                            reasons={reasons}
                                                        ></ProductInfoContainer>
                                                    </Flex>
                                                </Card>
                                            ))}

                                        <Flex mt={4} w={`100%`} justifyContent="space-between" gap={4}>
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
                                                type="submit"
                                                isDisabled={!isValid}
                                                colorScheme={'teal'}
                                                size={'xs'}
                                                h={`28px`}
                                                w={`100%`}
                                            >
                                                {RETURN_ACTION[actionType[0]]?.submitButtonlabel}
                                            </Button>
                                        </Flex>
                                    </Form>
                                )}
                            </Formik>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <CustomAlertDialog
                isOpen={isConfirmationOpen}
                onClose={handleCloseConfirmation}
                onConfirm={handleConfirmClick}
                title="Confirm Action"
                body={
                    RETURN_ACTION[actionType[0]]?.showRemarkInput ? (
                        <ConfirmDialog
                            initialValues={RETURN_ACTION[actionType[0]].initialValues}
                            formFields={RETURN_ACTION[actionType[0]].formFields}
                            onInputChange={handleFormValuesChange}
                        />
                    ) : (
                        'Are you sure you want to perform this action?'
                    )
                }
                cancelText="Cancel"
                confirmText="Confirm"
                isValid={isFormValid !== undefined ? isFormValid : RETURN_ACTION[actionType[0]].isFormValid}
            />
        </>
    )
}

export default ConvertToExchange
