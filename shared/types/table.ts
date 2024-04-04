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

export type ProductColumnItem = {
    sku_image: string
    quantity: number
    product_display_name: string
}
