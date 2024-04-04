import { IconType } from 'react-icons'

type ActionDetail = {
    actionName: string
    label: string
    icon?: string
}

export type Action = {
    outside: Array<ActionDetail>
    inside: Array<ActionDetail>
}
export type DynamicProp = { [key: string]: string }
export type ColumnsData = { [key: string]: string | string[] | boolean | Action | number | Array<DynamicProp> }

export type ActionParams = {
    fxnName: string
    fxnParams: Array<any>
}
export type NewData = {
    status: boolean
    groupIndex?: number
}
export type Params = {
    doAction: (params: ActionParams) => any
    updateData: (rowIndex: number, newData: NewData) => any
}

export type actionNewData = {
    rowIndex: number
    groupIndex?: number
}

export type SettingMenu = {
    name: string
    icon?: IconType
    url?: string
    subMenus?: SettingMenu[]
}
