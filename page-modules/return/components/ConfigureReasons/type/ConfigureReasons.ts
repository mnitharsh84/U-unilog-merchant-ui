import { Field } from 'shared/types/forms'

export type propertiesConfig = {
    code: string
    title: string
    description?: string
    required: boolean
    input_type: string
    values_and_prompts?: ValuesAndPrompts
    values?: string[]
    text_box_limit?: number
    fetch_value_set_from_oms: boolean
    allow_multiple_comma_separated?: boolean
    bool_value?: boolean
    str_values?: string[]
}

export type ValuesAndPrompts = {
    code: string
    value: string
    checked: boolean
    input_prompt: propertiesConfig
}

export type ConfigureReasonsMetaData = {
    version: string
    is_global: boolean
    text_config: propertiesConfig
    sub_reasons_config: propertiesConfig
    message_config: propertiesConfig
    properties_config: propertiesConfig[]
    rms_type: string
}

export type changeValueParams = { value: any; field: Field<any>; fieldKey: string }

export type OtherInitialData = {
    version: string
    is_global?: boolean
}

export type SubField = {
    code: string
    description: string
    fetch_value_set_from_oms: boolean
    input_type: string
    required: boolean
    title: string
    isSubField: boolean
    removeable: boolean
    initValue?: any
}
