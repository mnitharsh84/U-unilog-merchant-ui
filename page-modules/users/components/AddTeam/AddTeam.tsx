import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Checkbox,
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
import { DoActionParams } from 'page-modules/users/type/teams'
import { RolesType } from 'page-modules/users/type/type'
import { useEffect, useState } from 'react'
import FormField from 'shared/components/FormField/FormField'
import { formField } from 'shared/types/forms'
import * as Yup from 'yup'

type intialDataType = {
    name: string
    roleCodes: RolesType[]
    selectedRoleCodes: RolesType[]
    mode: string
    title: string
    id?: string
    enabled?: boolean
}
type Props = {
    doAction: (params: DoActionParams) => any
    initialData: intialDataType
}

export default function AddTeam({ doAction, initialData }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [user] = useState<formField[]>([
        {
            key: 'name',
            display: 'Name',
            initValue: initialData.name,
            placeHolder: 'Enter Team Name',
            type: 'text_input',
            validation: Yup.string().required('Required'),
            required: true,
        },
    ])
    const roleCodes = initialData && initialData.roleCodes ? initialData.roleCodes : []
    const groupOptions: string[] = []
    for (const item of roleCodes) {
        if (!groupOptions.includes(item.type)) {
            groupOptions.push(item.type)
        }
    }
    const selectedRoleCodes = initialData && initialData.selectedRoleCodes ? [...initialData.selectedRoleCodes] : []
    const [selectedRoles, setSelectedRoles] = useState<Array<RolesType>>(selectedRoleCodes)
    const handleCheckboxChange = (selectedValues: RolesType) => {
        if (
            selectedRoles.some(
                (item: RolesType) => item.name === selectedValues.name && item.type === selectedValues.type,
            )
        ) {
            setSelectedRoles(
                selectedRoles.filter(
                    (item: RolesType) => !(item.name === selectedValues.name && item.type === selectedValues.type),
                ),
            )
        } else {
            setSelectedRoles([...selectedRoles, selectedValues])
        }
    }

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

    const handleIsChecked = (item: RolesType) => {
        const result = selectedRoles.some(
            (selected) =>
                selected.name.toUpperCase() === item.name.toUpperCase() &&
                selected.type.toUpperCase() === item.type.toUpperCase(),
        )
        return result
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
                        initialValues={{
                            name: initialData.name,
                        }}
                        validationSchema={Yup.object().shape(
                            user.reduce((prev, filter) => ({ ...prev, [filter.key]: filter.validation }), {}),
                        )}
                        onSubmit={(values) => {
                            closeDrawer()
                            doAction({
                                values,
                                selectedRoles: selectedRoles,
                                teamId: initialData.id,
                                enabled: initialData.enabled,
                                action: initialData.mode,
                            })
                        }}
                        enableReinitialize={true}
                        validateOnMount={true}
                    >
                        {({ isValid }) => (
                            <Form>
                                <Grid templateColumns={'repeat(1, 1fr)'} columnGap={'1rem'} mt={4}>
                                    {user.map((data) => {
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
                                                        options: data.options?.map((opt) => ({
                                                            key: opt.key,
                                                            display: opt.display,
                                                            hidden: false,
                                                        })),
                                                        editable: data.editable,
                                                        minDate: data.minDate,
                                                    }}
                                                />
                                            </Flex>
                                        )
                                    })}
                                    <Flex flexWrap="wrap" flexDir="column" mt={4}>
                                        <Text fontSize="sm" color="gray.500" mb="2">
                                            {'Select Access roles'}
                                        </Text>

                                        <Accordion defaultIndex={[0]} allowMultiple>
                                            {groupOptions.map((group, index) => (
                                                <AccordionItem key={index}>
                                                    {() => (
                                                        <>
                                                            <h2>
                                                                <AccordionButton>
                                                                    <Box
                                                                        flex="1"
                                                                        fontSize="sm"
                                                                        color="gray.500"
                                                                        textAlign="left"
                                                                    >
                                                                        {`${group} Roles`}{' '}
                                                                        {`(${
                                                                            selectedRoles.filter(
                                                                                (selected: any) =>
                                                                                    selected.type === group,
                                                                            ).length
                                                                        })`}
                                                                    </Box>
                                                                    <AccordionIcon />
                                                                </AccordionButton>
                                                            </h2>
                                                            <AccordionPanel>
                                                                {roleCodes
                                                                    .filter((item) => item.type === group)
                                                                    .map((item, idx) => (
                                                                        <Box key={idx} mb={2}>
                                                                            <Checkbox
                                                                                key={`${item.name}${item.type}`}
                                                                                value={item.name}
                                                                                isChecked={handleIsChecked(item)}
                                                                                onChange={() =>
                                                                                    handleCheckboxChange(item)
                                                                                }
                                                                            >
                                                                                <Box fontSize="xs" color="gray.500">
                                                                                    {item.name}
                                                                                </Box>
                                                                            </Checkbox>
                                                                        </Box>
                                                                    ))}
                                                            </AccordionPanel>
                                                        </>
                                                    )}
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </Flex>
                                </Grid>

                                <Flex justify="flex-end" mt={4} gap={4}>
                                    <Button
                                        bg={`white`}
                                        variant={'outline'}
                                        onClick={handleCancel}
                                        size={'xs'}
                                        h={`28px`}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme={'teal'}
                                        size={'xs'}
                                        h={`28px`}
                                        type={'submit'}
                                        isDisabled={!isValid}
                                    >
                                        {`${initialData.mode} Team`}
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
