import {
    Box,
    Button,
    Card,
    Checkbox,
    Divider,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Input,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image'
import { RETURN_ACTION } from 'page-modules/return/config/config'
import { ManualApprovalData, ProductDetail, RefundData, Return } from 'page-modules/return/type/return'
import { Fragment, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import ConfirmDialog from 'shared/components/ConfirmDialog/ConfirmDialog'
import CustomAlertDialog from 'shared/components/CustomAlertDialog/CustomAlertDialog'
import styles from 'shared/styles/image.module.scss'

import { ExtraFieldsForApproval } from '../ExtraFieldsForApproval/ExtraFieldsForApproval'
import RefundDetail from '../RefundDetails/RefundDetail'

type Props = {
    returns: Return[]
    doAction: (params: any) => any
    actionType: string[]
    returnMergeEnable?: boolean
}
export default function ApproveRequest({ returns, doAction, actionType, returnMergeEnable }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedRequestId, setSelectedRequestId] = useState<string[]>([])
    const [itemQuantity, setItemQuantity] = useState<{ [key: string]: number }>({})
    const [validation, setValidation] = useState<{ [key: string]: boolean }>({})
    const [isConfirmationOpen, setConfirmationOpen] = useState(false)
    const [formValues, setFormValues] = useState<{ [key: string]: string }>({})
    const [isFormValid, setIsFormValid] = useState<boolean>()
    const [isSubmitBtnEnabled, setIsSubmitBtnEnabled] = useState<boolean>()
    const [refunddata, setRefundData] = useState<{ [key: string]: RefundData }>({})
    const [manualApprovedata, setManualApprovedata] = useState<ManualApprovalData>({} as ManualApprovalData)

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

    const handleConfirmClick = () => {
        // Close the confirmation dialog
        setConfirmationOpen(false)
        closeDrawer()
        doAction({
            action: actionType[0],
            requestedIds: selectedRequestId,
            itemQuantity: itemQuantity,
            remark: formValues && formValues['remark'] ? formValues['remark'] : '',
            refundData: refunddata,
            manualApprovalData: manualApprovedata,
        })
    }

    const handleOpenConfirmation = () => {
        // Open the confirmation dialog
        setConfirmationOpen(true)
    }

    const handleCloseConfirmation = () => {
        setConfirmationOpen(false)
    }
    const checkValidation = (obj: { [key: string]: boolean }) => {
        return Object.values(obj).some((value: boolean) => value === true)
    }
    const handleSubmit = () => {
        if (selectedRequestId.length === 0) {
            toast.error('Please select at least one return request!')
            return false
        }
        if (!checkValidation(validation)) {
            handleOpenConfirmation()
        } else {
            toast.error('Please enter valid quantity!')
        }
    }
    const getAllItemsForRequestId = (requestId: string, returns: Return[]) => {
        const selectedReturnRequest = returns.find((returnObj) => returnObj.requestId === requestId)
        const items = selectedReturnRequest?.items || []
        return items
    }
    const setQuantityOnSelectingRequestId = (requestId: string, returns: Return[]) => {
        const allItems = getAllItemsForRequestId(requestId, returns)
        updateQuantityInputField(allItems)
    }

    const resetQuantityOnUnSelectRequestId = (requestId: string, returns: Return[]) => {
        const allItems = getAllItemsForRequestId(requestId, returns)
        setItemQuantity((values) => {
            const newValues: { [key: string]: number } = { ...values }
            for (const item of allItems) {
                if (newValues[item.item_id]) {
                    delete newValues[item.item_id]
                }
            }
            return newValues
        })
        setValidation((prevValidation) => {
            const newPrevValidation: { [key: string]: boolean } = { ...prevValidation }
            for (const item of allItems) {
                if (newPrevValidation[item.item_id]) {
                    delete newPrevValidation[item.item_id]
                }
            }
            return newPrevValidation
        })
    }

    const updateQuantityInputField = (items: ProductDetail[]) => {
        const obj: { [key: string]: number } = {}
        for (const item of items) {
            obj[item.item_id] = item.quantity
        }
        setItemQuantity((values) => ({ ...values, ...obj }))
    }

    const handleCheckboxChange = (selectedId: string) => {
        if (!selectedRequestId.some((requestId: string) => requestId === selectedId)) {
            const newSelectedRequestIdData = [...selectedRequestId, selectedId]
            setSelectedRequestId(newSelectedRequestIdData)
            setQuantityOnSelectingRequestId(selectedId, returns)
        } else {
            const newSelectedRequestIdData = selectedRequestId.filter((requestId: string) => requestId !== selectedId)
            setSelectedRequestId(newSelectedRequestIdData)
            resetQuantityOnUnSelectRequestId(selectedId, returns)
        }
    }

    const handleQuantityOnBlur = (selectedId: string, itemId: string, quantity: number) => {
        if (selectedRequestId.some((requestId: string) => requestId === selectedId)) {
            const obj = { [itemId]: quantity }
            if (itemQuantity[itemId] === undefined) {
                setItemQuantity((prevItemQuantity) => ({
                    ...prevItemQuantity,
                    ...obj,
                }))
            }
        }
    }

    const handleQuantityChange = (event: any, quantity: number) => {
        const name = event.target.name
        const isNotValid =
            quantity < +event.target.value || 0 > +event.target.value || !Number.isInteger(+event.target.value) // Your validation logic for age
        const obj = { [name]: isNotValid }
        setValidation((prevValidation) => ({
            ...prevValidation,
            ...obj,
        }))
        if (event.target.value || event.target.value === '0') {
            setItemQuantity((values) => ({ ...values, [name]: +event.target.value }))
        } else {
            setItemQuantity((prevValues) => {
                const newValues = Object.fromEntries(Object.entries(prevValues).filter(([key]) => key !== name))
                return newValues
            })
        }
    }
    const handleFormValuesChange = (isFormValid: boolean, values: { [key: string]: string }) => {
        // Set the input value in the parent component
        setFormValues(values)
        setIsFormValid(isFormValid)
    }

    const handleRefundAmountValuesChange = (isFormValid: boolean, values: { [key: string]: RefundData }) => {
        // Set the input value in the parent component
        setRefundData(values)
        setIsSubmitBtnEnabled(isFormValid)
    }

    const handleManualApproveValuesChange = (isFormValid: boolean, values: ManualApprovalData) => {
        // Set the input value in the parent component
        setManualApprovedata(values)
        setIsSubmitBtnEnabled(isFormValid)
    }

    return (
        <>
            <Drawer isOpen={isOpen} onClose={handleCancel} placement="right" size="lg">
                <DrawerOverlay />
                <DrawerContent fontSize={'xs'}>
                    <DrawerHeader py={3} px={4} bg={`gray.100`} fontSize="md">
                        Select the {returnMergeEnable ? 'requests' : 'request'} you want to{' '}
                        {RETURN_ACTION[actionType[0]]?.title}
                    </DrawerHeader>
                    <DrawerCloseButton />
                    <DrawerBody>
                        <Flex gap="4" flexDir="column">
                            {returnMergeEnable && returns.length > 1 && RETURN_ACTION[actionType[0]]['note'] ? (
                                <Box>
                                    <Text as="span" fontWeight="bold">
                                        Tip:{' '}
                                    </Text>
                                    {RETURN_ACTION[actionType[0]]['note']}{' '}
                                </Box>
                            ) : null}
                            {returns &&
                                returns.map((groupItem, index: number) => (
                                    <Card p={4} key={index}>
                                        {groupItem.items.map((product, index) => (
                                            <Fragment key={`inner${index}`}>
                                                <Flex gap="4" flexDir="column">
                                                    {index === 0 && (
                                                        <>
                                                            <Flex flex="1" gap="4" flexDir="row">
                                                                <Box>
                                                                    <Checkbox
                                                                        isChecked={selectedRequestId.some(
                                                                            (requestId) =>
                                                                                requestId === product.requestId,
                                                                        )}
                                                                        onChange={() =>
                                                                            handleCheckboxChange(product.requestId)
                                                                        }
                                                                    ></Checkbox>
                                                                </Box>
                                                                {/* <Box flex="1" fontWeight="bold">
                                                                    Return ID
                                                                </Box> */}
                                                                <Box flex="1" fontWeight="bold">
                                                                    Product
                                                                </Box>
                                                                {actionType[0] === 'approve' ||
                                                                actionType[0] === 'manualApprove' ? (
                                                                    <Box flex="1" fontWeight="bold">
                                                                        Quantity
                                                                    </Box>
                                                                ) : null}
                                                                <Box flex="1" fontWeight="bold">
                                                                    Return Reason
                                                                </Box>
                                                            </Flex>
                                                            <Divider bg="gray.200" />
                                                        </>
                                                    )}
                                                    {index > 0 && <Divider mt={4} bg="gray.200" />}
                                                    <Flex gap="4" flex="1" flexDir="row">
                                                        {/* <Box flex="1">
                                                            <Text fontSize="sm">{product.requestId}</Text>
                                                        </Box> */}
                                                        {product.skuImage ? (
                                                            <Box className={styles.imageContainer}>
                                                                <Image
                                                                    loader={({ src }) => src}
                                                                    className={styles.imageCover}
                                                                    src={product.skuImage}
                                                                    alt={product.name}
                                                                    width="80"
                                                                    height="80"
                                                                />
                                                            </Box>
                                                        ) : (
                                                            <Flex flexDir="column" className={styles.noImageContainer}>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    className={styles.imageIcon}
                                                                >
                                                                    <img src="https://ngqa1.ucdn.in/assets/md-image.svg" />
                                                                </Box>
                                                                <Box
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    className={styles.noImageText}
                                                                >
                                                                    <Text fontSize="xs" textStyle="textInput">
                                                                        No Image
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                        )}

                                                        <Box flex="1">
                                                            <Text fontSize="sm">{product.name}</Text>
                                                            <Text fontSize="sm" fontWeight="bold" mt={2} mb={2}>
                                                                <Text as="span" color="blue.500">
                                                                    ₹{' '}
                                                                </Text>
                                                                {`${product.price} * ${product.quantity}`}
                                                            </Text>
                                                        </Box>
                                                        {actionType[0] === 'approve' ||
                                                        actionType[0] === 'manualApprove' ? (
                                                            <Box flex="1">
                                                                <Input
                                                                    placeholder="Enter Quantity"
                                                                    onBlur={() =>
                                                                        handleQuantityOnBlur(
                                                                            product.requestId,
                                                                            product.item_id,
                                                                            product.quantity,
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        !selectedRequestId.includes(product.requestId)
                                                                    }
                                                                    value={itemQuantity[product.item_id] ?? ''}
                                                                    className={`${
                                                                        validation[product.item_id]
                                                                            ? styles.invalidField
                                                                            : ''
                                                                    }`}
                                                                    name={product.item_id}
                                                                    type="number"
                                                                    onChange={(event) =>
                                                                        handleQuantityChange(event, product.quantity)
                                                                    }
                                                                ></Input>
                                                            </Box>
                                                        ) : null}
                                                        <Box flex="1">
                                                            <Text fontSize="sm">{product.reasonText}</Text>
                                                        </Box>
                                                    </Flex>
                                                </Flex>
                                            </Fragment>
                                        ))}
                                        {actionType[0] === 'manualApprove' && (
                                            <ExtraFieldsForApproval
                                                handleChange={handleManualApproveValuesChange}
                                            ></ExtraFieldsForApproval>
                                        )}
                                    </Card>
                                ))}
                            {actionType[0] === 'completeRefund' && selectedRequestId.length ? (
                                <RefundDetail
                                    handleChange={handleRefundAmountValuesChange}
                                    returns={returns}
                                    selectedRequestId={selectedRequestId}
                                ></RefundDetail>
                            ) : null}

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
                                    isDisabled={
                                        isSubmitBtnEnabled !== undefined
                                            ? isSubmitBtnEnabled
                                            : RETURN_ACTION[actionType[0]]?.isSubmitBtnDisabled
                                    }
                                    colorScheme={'teal'}
                                    size={'xs'}
                                    h={`28px`}
                                    w={`100%`}
                                    onClick={handleSubmit}
                                >
                                    {RETURN_ACTION[actionType[0]]?.submitButtonlabel}
                                </Button>
                            </Flex>
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
