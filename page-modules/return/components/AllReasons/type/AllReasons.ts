export type Functions = {
    edit: (param: Array<any>) => void
    remove: (param: Array<any>) => void
}
type Subreason = {
    id: string
    text: string
}
export type PropertyField = {
    code: string
    input_type: string
    selected_values?: any[]
    title: string
    checked?: any
    selected_value?: any
    entered_value?: string
    entered_values?: any
}
export type Reason = {
    id: string
    is_metadata_global: boolean
    message: string
    metadata_version: string
    properties: PropertyField[]
    rms_type: string
    status: boolean
    sub_reasons: Subreason[]
    text: string
}

export type RemoveReasonAPiPayload = {
    id: string
    status: boolean
    rms_type: string
}
