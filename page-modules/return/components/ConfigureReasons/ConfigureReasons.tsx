import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
    Button,
    Card,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Grid,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { getRmsReasonMetaData } from 'apis/return/get'
import { Form, Formik } from 'formik'
import { ApiUrl } from 'page-modules/return/config/config'
import { useMutationRmsReason } from 'page-modules/return/hooks/mutations'
import { isArrayOrObject } from 'page-modules/return/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import FormField from 'shared/components/FormField/FormField'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'
import { ExtendedFormField, Field, FieldOptions } from 'shared/types/forms'
import { INIT_VALUE_MAP } from 'shared/utils/forms'
import { createValidation, getType, setOptionForBooleanField } from 'shared/utils/functions'
import { Schema } from 'yup'
import * as Yup from 'yup'

import {
    ConfigureReasonsMetaData,
    OtherInitialData,
    SubField,
    ValuesAndPrompts,
    changeValueParams,
    propertiesConfig,
} from './type/ConfigureReasons'

const skeletonMetaData = {
    noOfColumnPerRow: 1,
    marginTop: 8,
}
let validationSchema: Schema | undefined
const getOptionsValues = (field: any): FieldOptions[] => {
    switch (field.input_type) {
        case 'SELECT_BOX':
        case 'MULTI_SELECT_BOX':
            return Array.isArray(field.values_and_prompts)
                ? field.values_and_prompts.map((value: ValuesAndPrompts) => ({
                      key: `${field.code}|${value.code}`,
                      display: value.value,
                      hidden: false,
                  }))
                : []
        case 'BOOLEAN':
            return setOptionForBooleanField()
        default:
            return []
    }
}

const setFormFieldValue = (field: any) => {
    return {
        key: field.code,
        type: getType(field.input_type),
        original_type: field.input_type,
        placeHolder: '',
        display: field.title,
        initValue:
            field.initValue || field.initValue === false
                ? field.initValue
                : JSON.parse(JSON.stringify(INIT_VALUE_MAP[getType(field.input_type)])),
        options: getOptionsValues(field),
        validation: validationSchema,
        editable: true,
        required: field.required,
        info: field.description,
        textBoxLimit: field?.text_box_limit,
        originFormOptions: field.options,
        valuesAndPrompts: field.values_and_prompts,
        subFormFields: [],
        isSubField: field.isSubField,
        removeable: field.removeable,
    }
}

const createFormField = (value: any): any => {
    if (isArrayOrObject(value)) {
        if (Array.isArray(value)) {
            // If it's an array, process each element recursively
            const fields: ExtendedFormField<any>[] = []
            for (const item of value) {
                const field = createFormField(item)
                // field.validation = createValidation(field);
                fields.push(field)
            }
            return fields
        } else if (typeof value === 'object') {
            // If it's an object, process it and return a FormField
            const field: ExtendedFormField<any> = setFormFieldValue(value)
            field.validation = createValidation(field)
            return field
        }
    }
    // Handle other cases here or return null/undefined if needed.
    return null
}
const addSubFieldForEditReason = (formFields: any, intialValue: string, serverData: { [key: string]: any }) => {
    if (formFields.original_type === 'SELECT_BOX') {
        const seletedValue = intialValue ? intialValue.split('|')[1] : ''
        const selectedOption = formFields.valuesAndPrompts.find((value: any) => value.code === seletedValue)
        if (selectedOption && selectedOption.input_prompt) {
            const key = `${formFields.key}|${selectedOption.code}`
            const newField = createSubField(
                selectedOption.input_prompt,
                key,
                selectedOption.code,
                selectedOption.required,
            )
            newField['initValue'] = serverData[key]
            const formField = createFormField(newField)

            if (
                selectedOption.input_prompt.api_key &&
                selectedOption.input_prompt.fetch_value_set_from_oms &&
                selectedOption.input_prompt.input_type === 'INPUT_BOX'
            ) {
                formField.type = 'multi_select_search'
                formField.apiDetail = ApiUrl[selectedOption.input_prompt.api_key]
            } else if (
                Array.isArray(selectedOption.input_prompt.str_values) &&
                selectedOption.input_prompt.str_values.length
            ) {
                formField.type = selectedOption.input_prompt.allow_multiple_comma_separated ? 'multi_select' : 'select'
                formField['initValue'] =
                    formField.type === 'select' && Array.isArray(serverData[key])
                        ? serverData[key][0]
                        : newField['initValue']
                formField.options = selectedOption.input_prompt.str_values.map((data: { [key: string]: any }) => {
                    return {
                        key: data.code,
                        display: data.displayName,
                        hidden: false,
                    }
                })
            } else if ((formField.type = 'text_input')) {
                formField['initValue'] = Array.isArray(serverData[key]) ? serverData[key][0] : newField['initValue']
            }
            const subFormFields = formFields.subFormFields || []
            formField.validation = createValidation(formField)
            subFormFields.push(formField)
            formFields.subFormFields = [...subFormFields]
        }
    }
    if (formFields.original_type === 'MULTI_SELECT_BOX') {
        const seletedValue: string[] = []
        formFields.valuesAndPrompts.forEach((selectedOption: any) => {
            const key = `${formFields.key}|${selectedOption.code}`
            const formFieldsServerData: string[] = serverData[formFields.key]
            if (Array.isArray(formFieldsServerData) && formFieldsServerData.includes(key)) {
                seletedValue.push(key)
                if (selectedOption.input_prompt) {
                    const key = `${formFields.key}|${selectedOption.code}`
                    const newField = createSubField(
                        selectedOption.input_prompt,
                        key,
                        selectedOption.code,
                        selectedOption.required,
                    )
                    newField['initValue'] = serverData[key]
                    const formField = createFormField(newField)

                    if (
                        selectedOption.input_prompt.fetch_value_set_from_oms &&
                        selectedOption.input_prompt.input_type === 'INPUT_BOX' &&
                        selectedOption.input_prompt.api_key
                    ) {
                        formField.type = 'multi_select_search'
                        const apiKey = selectedOption.input_prompt.api_key
                        formField.apiDetail = ApiUrl[apiKey]
                    } else if (
                        Array.isArray(selectedOption.input_prompt.str_values) &&
                        selectedOption.input_prompt.str_values.length
                    ) {
                        formField.type = selectedOption.input_prompt.allow_multiple_comma_separated
                            ? 'multi_select'
                            : 'select'
                        formField['initValue'] =
                            formField.type === 'select' && Array.isArray(serverData[key])
                                ? serverData[key][0]
                                : newField['initValue']
                        formField.options = selectedOption.input_prompt.str_values.map(
                            (data: { [key: string]: any }) => {
                                return {
                                    key: data.code,
                                    display: data.displayName,
                                    hidden: false,
                                }
                            },
                        )
                    }
                    const subFormFields = formFields.subFormFields || []
                    formField.validation = createValidation(formField)
                    subFormFields.push(formField)
                    formFields.subFormFields = [...subFormFields]
                }
            }
        })
    }
}

const createFormFieldForEdit = (value: any, serverData: any): any => {
    if (isArrayOrObject(value)) {
        if (Array.isArray(value)) {
            // If it's an array, process each element recursively
            const fields: any[] = []
            for (const item of value) {
                const field = createFormFieldForEdit(item, serverData)
                if ((serverData[field.key], field.valuesAndPrompts)) {
                    addSubFieldForEditReason(field, serverData[field.key], serverData)
                }
                fields.push(field)
            }
            return fields
        } else if (typeof value === 'object') {
            // If it's an object, process it and return a FormField
            if (serverData[value.code] || serverData[value.code] === false) {
                value.initValue = serverData[value.code]
            }
            const field: any = setFormFieldValue(value)
            field.validation = createValidation(field)
            return field
        }
    }
    // Handle other cases here or return null/undefined if needed.
    return null
}
const createSubField = (field: propertiesConfig, key: string, code: string, isRequired: boolean): SubField => {
    const newField = {
        code: key,
        description: '',
        fetch_value_set_from_oms: field.fetch_value_set_from_oms,
        input_type: field.input_type,
        required: isRequired,
        title: code ? code.replace(/_/g, ' ') : '',
        isSubField: true,
        removeable: false,
    }
    return newField
}

const createPayloadforFieldHavingPrompt = (
    currentFormField: ValuesAndPrompts,
    promptFieldKey: string,
    formData: { [key: string]: any },
) => {
    const field: { [key: string]: any } = {
        code: currentFormField.code,
        value: currentFormField.value,
        checked: true,
    }
    if (currentFormField.input_prompt) {
        field['input_prompt'] = { ...currentFormField.input_prompt }
        if (formData[promptFieldKey]) {
            field['input_prompt']['str_values'] = Array.isArray(formData[promptFieldKey])
                ? formData[promptFieldKey].map((val: string) => {
                      return { code: val }
                  })
                : [{ code: formData[promptFieldKey] }]
        }
    }

    return field
}
const createFormFieldEditReason = (data: ConfigureReasonsMetaData, serverData: any) => {
    let formFields: ExtendedFormField<any>[] = []
    for (const key in data) {
        const value = data[key as keyof ConfigureReasonsMetaData]
        const field = createFormFieldForEdit(value, serverData)
        if (Array.isArray(field)) {
            formFields = [...formFields, ...field]
        } else if (field) {
            if (field.key === 'sub_reasons') {
                for (let i = 0; i < serverData['sub_reasons'].length; i++) {
                    if (i === 0) {
                        field.initValue = serverData['sub_reasons'][i].text
                    } else {
                        addSubReasonField(field, value, serverData['sub_reasons'][i].text)
                    }
                }
            }
            formFields.push(field)
        }
    }
    return formFields
}

const addSubReasonField = (formfield: any, field: any, intialValue: string) => {
    const index = Array.isArray(formfield.subFormFields) ? formfield.subFormFields.length + 1 : 1
    const newField = {
        code: `${field.code}|${index}`,
        description: '',
        fetch_value_set_from_oms: field.fetch_value_set_from_oms,
        input_type: field.type,
        required: false,
        title: `${field.title}(${index + 1})`,
        removeable: true,
        isSubField: true,
        initValue: intialValue,
    }

    if (field) {
        const formField = createFormField(newField)
        const subFormFields = formfield.subFormFields ? formfield.subFormFields : []
        if (field.text_box_limit && subFormFields.length < field.text_box_limit - 1) {
            subFormFields.push(formField)
            formfield['subFormFields'] = [...subFormFields]
        }
    }
}

const getSubReasonsValue = (formData: any, key: string, formFields: ExtendedFormField<any>[]) => {
    let subReasonsValues: string[] = []
    const subReasonsField = formFields.find((formField) => formField.key === key)
    if (subReasonsField && subReasonsField.textBoxLimit && subReasonsField.textBoxLimit > 1) {
        for (let i = 0; i < subReasonsField.textBoxLimit; i++) {
            const subreasonKey = `${key}${i > 0 ? `|${i}` : ''}`
            if (formData[subreasonKey] && formData[key]) {
                const val = Array.isArray(formData[subreasonKey]) ? '' : formData[subreasonKey]
                subReasonsValues = [...subReasonsValues, val]
            }
        }
    } else if (subReasonsField) {
        const val = formData[key]
        subReasonsValues.push(val)
    }
    return subReasonsValues
}
const setNonPropertiesField = (
    formData: any,
    formFields: ExtendedFormField<any>[],
    otherInitialData: any,
    rmsType: string,
) => {
    return {
        rms_type: rmsType,
        text: formData['name'],
        sub_reasons: getSubReasonsValue(formData, 'sub_reasons', formFields),
        message: formData['message'],
        is_metadata_global: true,
        metadata_version: otherInitialData?.version,
        status: true,
    }
}

const getMultiSelectBoxValues = (data: string[]) => {
    const selectedValues: { [key: string]: any } = {}
    data.map((val) => {
        const splitArray = val.split('|')
        if (splitArray.length) {
            const key = splitArray[1]
            selectedValues[key] = splitArray[1]
        }
    })
    return selectedValues
}
const getSelectBoxValue = (data: string) => {
    const selectedValues: { [key: string]: any } = {}
    const splitArray = data.split('|')
    if (splitArray.length) {
        const key = splitArray[1]
        selectedValues[key] = splitArray[1]
    }
    return selectedValues
}
const removeSubFieldInMultiSelectField = (
    paramsData: changeValueParams,
    parentField: ExtendedFormField<any>,
    selectedValue: string,
    preInitialValues: { [key: string]: any },
) => {
    if (paramsData.field.type === 'multi_select' && parentField.valuesAndPrompts) {
        const getSelectedOption = parentField.valuesAndPrompts.find((value) => value.code === selectedValue)
        const key = `${parentField.key}|${getSelectedOption.code}`
        const unCheckedValue = `${parentField.key}|${selectedValue}`
        preInitialValues[paramsData.fieldKey] = preInitialValues[paramsData.fieldKey].filter(
            (val: string) => val !== unCheckedValue,
        )
        parentField.subFormFields = parentField.subFormFields?.filter((formField) => formField.key !== key)
    }
}
const findField = (fields: any, key: string): ExtendedFormField<any> | null => {
    let result: ExtendedFormField<any> | null = null

    fields.some((formField: ExtendedFormField<any>) => {
        if (formField.key === key) {
            result = formField
            return true // Stop the loop
        } else if (Array.isArray(formField.subFormFields)) {
            result = findField(formField.subFormFields, key)
            return result !== null // Continue if result is not null
        }
        return false // Continue if no match found
    })

    return result
}
const rmsReasonApiUrl = 'session/api/v1/rms/reason'
type Props = {
    initialReasonData: any
    doAction: (params: any) => any
}
export default function ConfigureReasons({ initialReasonData, doAction }: Props) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const ref = useRef(null)
    const [otherInitialData, setOtherInitialData] = useState<OtherInitialData>({
        version: '',
    })
    const [initialData, setInitialData] = useState<ExtendedFormField<any>[]>([])

    const [customIsLoading, setCustomIsLoading] = useState<boolean>(true)
    let reasonsMetadataApiUrl = `session/api/v1/rms/reason/metadata?rms_type=${initialReasonData.serverData.rms_type}`
    if (initialReasonData.mode === 'Update') {
        reasonsMetadataApiUrl = `${reasonsMetadataApiUrl}&is_global=${initialReasonData.serverData.is_metadata_global}&version=${initialReasonData.serverData.metadata_version}`
    }
    const { isError } = useQuery({
        queryKey: ['get-rms-reason-metadata'],
        queryFn: () => getRmsReasonMetaData(reasonsMetadataApiUrl),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error) => {
            console.error('An error occurred:', error)
            setCustomIsLoading(false)
            // You can set state or perform other actions here based on the error
        },
    })
    useEffect(() => {
        onOpen()
        return () => {
            onClose() // Ensure drawer is closed when component unmounts
        }
    }, [])

    const handleQuerySuccess = (data: ConfigureReasonsMetaData[]) => {
        let formFields: ExtendedFormField<any>[] = []
        if (initialReasonData && initialReasonData.mode.toUpperCase() === 'UPDATE') {
            formFields = createFormFieldEditReason(data[0], initialReasonData.serverData)
        } else {
            for (const key in data[0]) {
                const value = data[0][key as keyof ConfigureReasonsMetaData]
                const field = createFormField(value)
                if (Array.isArray(field)) {
                    formFields = [...formFields, ...field]
                } else if (field) {
                    formFields.push(field)
                }
            }
        }

        if (initialReasonData && initialReasonData.mode.toUpperCase() === 'UPDATE') {
            // getIntialValueFromServerData(formFields, initialReasonData.serverData);
            setOtherInitialData({
                version: initialReasonData.serverData.metadata_version,
                is_global: initialReasonData.serverData.is_metadata_global,
            })
        } else {
            setOtherInitialData({ version: data[0].version, is_global: data[0].is_global })
        }
        setInitialData([...formFields])
        setCustomIsLoading(false)
    }

    const mutation = useMutationRmsReason(rmsReasonApiUrl)

    const setInitalValueForForm = useMemo(() => {
        const initialValues: { [key: string]: any } = {}

        initialData.forEach((fields: any) => {
            initialValues[fields.key] = fields.initValue
            if (fields.subFormFields && fields.subFormFields.length) {
                fields.subFormFields.forEach((formField: any) => {
                    initialValues[formField.key] = formField.initValue
                })
            }
        })
        return initialValues
    }, [initialData])

    const createPayload = (formData: any) => {
        return setNonPropertiesField(formData, initialData, otherInitialData, initialReasonData.serverData['rms_type'])
    }

    const handleFormSubmit = (formData: any) => {
        let payload: { [key: string]: any } = {}
        payload = createPayload(formData)
        const properties = []
        for (const key in formData) {
            if (payload[key] === undefined && key !== 'name') {
                let fieldPayload: { [key: string]: any } = {}
                const formField = initialData.find((formField) => formField.key === key)
                if (formField) {
                    fieldPayload = {
                        code: formField.key,
                        input_type: formField.original_type,
                    }

                    if (formField.original_type === 'MULTI_SELECT_BOX') {
                        fieldPayload['selected_values'] = []
                        const selected_value = getMultiSelectBoxValues(formData[key])
                        if (formField.valuesAndPrompts && selected_value) {
                            for (let i = 0; i < formField.valuesAndPrompts.length; i++) {
                                const currentFormField: ValuesAndPrompts = formField.valuesAndPrompts[i]
                                const promptFieldKey = `${formField.key}|${currentFormField.code}`
                                if (selected_value[currentFormField.code]) {
                                    const field = createPayloadforFieldHavingPrompt(
                                        currentFormField,
                                        promptFieldKey,
                                        formData,
                                    )
                                    fieldPayload['selected_values'].push(field)
                                }
                            }
                        }
                        properties.push(fieldPayload)
                    }
                    if (formField.original_type === 'SELECT_BOX') {
                        fieldPayload['selected_value'] = {}
                        const selected_value = getSelectBoxValue(formData[key])
                        if (formField.valuesAndPrompts && selected_value) {
                            for (let i = 0; i < formField.valuesAndPrompts.length; i++) {
                                const currentFormField: ValuesAndPrompts = formField.valuesAndPrompts[i]
                                const promptFieldKey = `${formField.key}|${currentFormField.code}`
                                if (selected_value[currentFormField.code]) {
                                    const field = createPayloadforFieldHavingPrompt(
                                        currentFormField,
                                        promptFieldKey,
                                        formData,
                                    )
                                    fieldPayload['selected_value'] = field
                                }
                            }
                        }
                        properties.push(fieldPayload)
                    }
                    if (formField.original_type === 'BOOLEAN') {
                        fieldPayload['checked'] = {}
                        const selected_value =
                            typeof formData[key] === 'string' ? getSelectBoxValue(formData[key]) : false
                        if (formField.valuesAndPrompts && selected_value) {
                            for (let i = 0; i < formField.valuesAndPrompts.length; i++) {
                                const currentFormField: ValuesAndPrompts = formField.valuesAndPrompts[i]
                                const promptFieldKey = `${formField.key}|${currentFormField.code}`
                                if (selected_value[currentFormField.code]) {
                                    const field = createPayloadforFieldHavingPrompt(
                                        currentFormField,
                                        promptFieldKey,
                                        formData,
                                    )
                                    fieldPayload['checked'] = field
                                }
                            }
                        } else {
                            fieldPayload['checked'] = {
                                code: formField.key,
                                value: formData[key] === 'true' || formData[key] === true ? true : false,
                                checked: formData[key] === 'true' || formData[key] === true ? true : false,
                            }
                        }
                        properties.push(fieldPayload)
                    }
                    if (formField.original_type === 'INPUT_BOX') {
                        fieldPayload['entered_value'] = formData[key]
                        properties.push(fieldPayload)
                    }
                }
            }
        }

        payload['properties'] = properties
        if (initialReasonData.id) {
            payload['id'] = initialReasonData.id
        }
        mutation.mutate(payload, {
            onSuccess: (data) => {
                if (data && data.successful) {
                    const message = data.message
                        ? data.message
                        : initialReasonData.mode.toUpperCase() === 'CREATE'
                        ? 'Reason added successfully!'
                        : 'Reason updated successfully!'
                    toast.success(message)
                    doAction({ action: initialReasonData.mode })
                }
            },
            onError: (error) => {
                // Handle error cases
                console.error(error)
            },
        })
    }

    const addField = (field: any) => {
        const index = Array.isArray(field.subFormFields) ? field.subFormFields.length + 1 : 1
        const newField = {
            code: `${field.key}|${index}`,
            description: '',
            fetch_value_set_from_oms: field.fetch_value_set_from_oms,
            input_type: field.type,
            required: false,
            title: `${field.display}(${index + 1})`,
            removeable: true,
            isSubField: true,
        }
        const updatedInitialData = [...initialData]
        const searchField: ExtendedFormField<any> | null = findField(updatedInitialData, field.key)

        if (searchField) {
            const formField = createFormField(newField)
            const subFormFields = searchField.subFormFields ? searchField.subFormFields : []
            if (searchField.textBoxLimit && subFormFields.length < searchField.textBoxLimit - 1) {
                subFormFields.push(formField)
                searchField.subFormFields = [...subFormFields]
            }
            const preInitialValues: { [key: string]: any } = (ref?.current ?? { values: {} }).values || {}
            setFormFieldInitialValues(updatedInitialData, preInitialValues)
            setInitialData(updatedInitialData)
        }
    }

    const setFormFieldInitialValues = (updatedInitialData: any, preInitialValues: any) => {
        updatedInitialData.forEach((fields: any) => {
            fields.initValue =
                preInitialValues[fields.key] !== undefined ? preInitialValues[fields.key] : fields.initValue

            if (fields.subFormFields && fields.subFormFields.length) {
                fields.subFormFields.forEach((formField: any) => {
                    formField.initValue =
                        preInitialValues[formField.key] !== undefined
                            ? preInitialValues[formField.key]
                            : formField.initValue
                })
            }
        })
    }

    const removeField = (field: any, parentFieldKey: string) => {
        const updatedInitialData = [...initialData]
        const parentField: ExtendedFormField<any> | null = findField(updatedInitialData, parentFieldKey)
        if (field.isSubField && parentField) {
            const searchSubField: ExtendedFormField<any> | null = findField(updatedInitialData, field.key)
            if (searchSubField && Array.isArray(parentField.subFormFields)) {
                parentField.subFormFields = parentField.subFormFields?.filter(
                    (formField) => formField.key !== searchSubField.key,
                )
                parentField.subFormFields = [...parentField.subFormFields]
            }
            setInitialData(updatedInitialData)
        }
    }

    const removeSubFieldSingleSelect = (
        paramsData: changeValueParams,
        parentField: ExtendedFormField<any>,
        preInitialValues: { [key: string]: any },
    ) => {
        const subFormField: Array<any> = []
        preInitialValues[paramsData.fieldKey] = paramsData.value
        parentField.subFormFields = [...subFormField]
    }

    const updateState = (updatedInitialData: ExtendedFormField<any>[], preInitialValues: { [key: string]: any }) => {
        setFormFieldInitialValues(updatedInitialData, preInitialValues)
        setInitialData(updatedInitialData)
    }

    const updatePreInitalValues = (preInitialValues: { [key: string]: any }, paramsData: changeValueParams) => {
        if (paramsData.field.type === 'multi_select') {
            preInitialValues[paramsData.fieldKey] = [...preInitialValues[paramsData.fieldKey], paramsData.value]
            const uniqueSet = new Set(preInitialValues[paramsData.fieldKey])
            preInitialValues[paramsData.fieldKey] = Array.from(uniqueSet)
        } else {
            preInitialValues[paramsData.fieldKey] = paramsData.value
        }
    }
    const handleChangeValue = (params: { value: any; field: Field<any>; fieldKey: string }) => {
        const paramsData = { ...params }
        if (!paramsData.value) {
            return handleEmptyValue(paramsData.fieldKey, paramsData.value)
        }
        if (paramsData.value) {
            const data = paramsData.value.split('|')
            const parentFieldName = data[0]
            const selectedValue = data[1]
            if (paramsData.field.type === 'select' || paramsData.field.type === 'multi_select') {
                handleSelectValue(parentFieldName, selectedValue, paramsData)
            }
        }
    }

    const handleInputPromptEmpty = (parentFieldName: string, paramsData: changeValueParams) => {
        if (paramsData.field.type === 'select') {
            const updatedInitialData = [...initialData]
            const preInitialValues: { [key: string]: any } = (ref?.current ?? { values: {} }).values || {}
            const parentField = findField(updatedInitialData, parentFieldName)
            if (!parentField) {
                return
            }
            removeSubFieldSingleSelect(paramsData, parentField, preInitialValues)
            updateState(updatedInitialData, preInitialValues)
        }
    }

    const handleSelectValue = (parentFieldName: string, selectedValue: string, paramsData: changeValueParams) => {
        const updatedInitialData = [...initialData]
        const parentField = findField(updatedInitialData, parentFieldName)
        if (!parentField || !parentField.valuesAndPrompts) {
            return
        }

        const getSelectedOption = parentField.valuesAndPrompts.find((value) => value.code === selectedValue)
        if (!getSelectedOption || !getSelectedOption.input_prompt) {
            return handleInputPromptEmpty(parentFieldName, paramsData)
        }

        const key = `${parentField.key}|${getSelectedOption.code}`
        const newField = createSubField(
            getSelectedOption.input_prompt,
            key,
            getSelectedOption.code,
            getSelectedOption.required,
        )
        const formField = createFormField(newField)
        let subFormFields = parentField.subFormFields || []

        if (!subFormFields.find((formField) => formField.key === key)) {
            subFormFields = []
            if (
                getSelectedOption.input_prompt.fetch_value_set_from_oms &&
                getSelectedOption.input_prompt.input_type === 'INPUT_BOX'
            ) {
                formField.type = 'multi_select_search'
                const apiKey = getSelectedOption.input_prompt.api_key
                formField.apiDetail = ApiUrl[apiKey]
            } else if (
                Array.isArray(getSelectedOption.input_prompt.str_values) &&
                getSelectedOption.input_prompt.str_values.length
            ) {
                formField.type = getSelectedOption.input_prompt.allow_multiple_comma_separated
                    ? 'multi_select'
                    : 'select'
                formField.options = getSelectedOption.input_prompt.str_values.map((data: { [key: string]: any }) => {
                    return {
                        key: data.code,
                        display: data.displayName,
                        hidden: false,
                    }
                })
            }

            formField.validation = createValidation(formField)
            subFormFields.push(formField)
            parentField.subFormFields = [...subFormFields]

            const preInitialValues: { [key: string]: any } = (ref?.current ?? { values: {} }).values || {}
            updatePreInitalValues(preInitialValues, paramsData)
            setFormFieldInitialValues(updatedInitialData, preInitialValues)
            setInitialData(updatedInitialData)
        } else {
            const preInitialValues: { [key: string]: any } = (ref?.current ?? { values: {} }).values || {}
            removeSubFieldInMultiSelectField(paramsData, parentField, selectedValue, preInitialValues)
            updateState(updatedInitialData, preInitialValues)
        }
    }

    const handleEmptyValue = (fieldKey: string, value: any) => {
        const updatedInitialData = [...initialData]
        const parentField = findField(updatedInitialData, fieldKey)
        if (!parentField) {
            return
        }

        const preInitialValues: { [key: string]: any } = (ref?.current ?? { values: {} }).values || {}
        preInitialValues[fieldKey] = value
        parentField.subFormFields = []
        setFormFieldInitialValues(updatedInitialData, preInitialValues)
        setInitialData(updatedInitialData)
    }

    const getValidationSchema = useMemo(() => {
        return Yup.object().shape(
            initialData.reduce((prev, formField) => {
                const fieldValidation = {
                    [formField.key]: formField.validation,
                }

                if (formField.subFormFields && formField.subFormFields.length) {
                    const subFieldValidation = formField.subFormFields.reduce((subPrev, subFormField) => {
                        return {
                            ...subPrev,
                            [subFormField.key]: subFormField.validation,
                        }
                    }, {})

                    // Merge subFieldValidation with fieldValidation
                    Object.assign(fieldValidation, subFieldValidation)
                }

                return {
                    ...prev,
                    ...fieldValidation,
                }
            }, {}),
        )
    }, [initialData]) // Add initialData as a dependency

    const closeDrawer = () => {
        onClose()
    }

    const handleCancel = () => {
        closeDrawer()
        doAction({ action: 'cancel' })
    }

    return (
        <Drawer isOpen={isOpen} onClose={handleCancel} placement="right" size="md">
            <DrawerOverlay />
            <DrawerContent fontSize={'xs'}>
                <DrawerHeader py={3} px={4} bg={`gray.100`} fontSize="md">
                    {initialReasonData.title}
                </DrawerHeader>
                <DrawerCloseButton />
                <DrawerBody>
                    {customIsLoading && (
                        <Flex flexDir="column" justifyContent="space-between" h={`100%`} overflow="auto" p="4">
                            <FormSkelton
                                rows="8"
                                columns="1"
                                colWidth="100%"
                                noOfColumnPerRow={skeletonMetaData.noOfColumnPerRow}
                                marginTop={skeletonMetaData.marginTop}
                            />
                        </Flex>
                    )}
                    {isError && (
                        <Center h="400px">
                            <ErrorPlaceholder />
                        </Center>
                    )}
                    {!customIsLoading && !isError ? (
                        <Formik
                            innerRef={ref}
                            initialValues={setInitalValueForForm}
                            validationSchema={getValidationSchema}
                            onSubmit={(values: any, { setSubmitting }) => {
                                handleFormSubmit(values)
                                // Manually set submitting to false
                                setSubmitting(false)
                            }}
                            enableReinitialize={true}
                            validateOnMount={true}
                        >
                            {({ isValid }) => (
                                <Form>
                                    <Grid
                                        templateColumns={['1fr', 'repeat(1, 1fr)']}
                                        columnGap={'1rem'}
                                        mt={4}
                                        alignContent="stretch"
                                    >
                                        {initialData.map((field, index) => {
                                            return (
                                                <Flex
                                                    gap={1}
                                                    flexDir={'column'}
                                                    alignItems={'flex-start'}
                                                    mb={4}
                                                    key={`${field.key}${index}`}
                                                    flex={1}
                                                >
                                                    <Card p="4" width="100%">
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
                                                            {field.info && (
                                                                <Tooltip label={field.info} hasArrow>
                                                                    <InfoOutlineIcon color="gray.400" ml={1} />
                                                                </Tooltip>
                                                            )}
                                                        </Text>
                                                        <Flex
                                                            gap={1}
                                                            flexDir={'column'}
                                                            alignItems={'flex-start'}
                                                            mb={4}
                                                        >
                                                            <Flex width="100%">
                                                                <FormField
                                                                    fieldKey={field.key}
                                                                    field={{
                                                                        display: field.display,
                                                                        hidden: false,
                                                                        type: field.type,
                                                                        init_value: field.initValue,
                                                                        placeholder: field.placeHolder,
                                                                        required: field.required,
                                                                        options: field.options?.map((opt) => ({
                                                                            key: opt.key,
                                                                            display: opt.display,
                                                                            hidden: false,
                                                                        })),
                                                                        editable: field.editable,
                                                                        minDate: field.minDate,
                                                                    }}
                                                                    changeValue={handleChangeValue}
                                                                />
                                                                {field.textBoxLimit && (
                                                                    <Button
                                                                        as="span"
                                                                        key={`${field.key}${index}`}
                                                                        onClick={() => addField(field)}
                                                                        ml="2"
                                                                        size="sm"
                                                                    >
                                                                        Add
                                                                    </Button>
                                                                )}
                                                            </Flex>

                                                            {Array.isArray(field.subFormFields) &&
                                                            field.subFormFields.length
                                                                ? field.subFormFields.map((subField, index) => (
                                                                      <Flex
                                                                          gap={1}
                                                                          flexDir={'column'}
                                                                          alignItems={'flex-start'}
                                                                          key={`outer-${subField.key}${index}`}
                                                                          flex={1}
                                                                          width="100%"
                                                                      >
                                                                          {subField.display && (
                                                                              <Text
                                                                                  key={`text-${field.key}-${index}`}
                                                                                  as={'span'}
                                                                                  fontSize={'sm'}
                                                                                  fontWeight="bold"
                                                                                  color={'gray.500'}
                                                                                  textTransform={'capitalize'}
                                                                                  ps={3}
                                                                                  mt="4"
                                                                                  className={`${
                                                                                      subField.required
                                                                                          ? 'required-field'
                                                                                          : ''
                                                                                  }`}
                                                                              >
                                                                                  {subField.display}
                                                                              </Text>
                                                                          )}
                                                                          <Flex
                                                                              flexDir={`${
                                                                                  !subField.removeable
                                                                                      ? 'column'
                                                                                      : 'row'
                                                                              }`}
                                                                              key={`${subField.key}${index}`}
                                                                              width="100%"
                                                                              mt={`${subField.display ? 4 : 0}`}
                                                                          >
                                                                              <FormField
                                                                                  fieldKey={subField.key}
                                                                                  field={{
                                                                                      display: subField.display,
                                                                                      hidden: false,
                                                                                      type: subField.type,
                                                                                      init_value: subField.initValue,
                                                                                      placeholder: subField.placeHolder,
                                                                                      required: subField.required,
                                                                                      options: subField.options?.map(
                                                                                          (opt) => ({
                                                                                              key: opt.key,
                                                                                              display: opt.display,
                                                                                              hidden: false,
                                                                                          }),
                                                                                      ),
                                                                                      editable: subField.editable,
                                                                                      minDate: subField.minDate,
                                                                                  }}
                                                                                  changeValue={handleChangeValue}
                                                                                  searchFieldApiDetail={
                                                                                      subField.apiDetail
                                                                                  }
                                                                              />
                                                                              {subField.removeable && (
                                                                                  <Button
                                                                                      as="span"
                                                                                      onClick={() =>
                                                                                          removeField(
                                                                                              subField,
                                                                                              field.key,
                                                                                          )
                                                                                      }
                                                                                      ml="2"
                                                                                      size="sm"
                                                                                  >
                                                                                      Remove
                                                                                  </Button>
                                                                              )}
                                                                          </Flex>
                                                                      </Flex>
                                                                  ))
                                                                : null}
                                                        </Flex>

                                                        <Text
                                                            as={'span'}
                                                            fontSize={'sm'}
                                                            color={'gray.500'}
                                                            textTransform={'capitalize'}
                                                            ps={3}
                                                            pt={3}
                                                        >
                                                            {field.extraInfo}
                                                        </Text>
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
                    ) : null}
                </DrawerBody>
            </DrawerContent>
        </Drawer>
    )
}
