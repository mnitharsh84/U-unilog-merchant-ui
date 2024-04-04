export type CalculateEDDPayload = {
    sku: string
    pincode: string
}

export type CalculateEDDResponse = {
    courierCode: string
    courierName: string
    mode: string
    time: string
    warehouse: string
}[]

export type EDD = {
    courierCode: string
    courierName: string
    warehouse: string
    mode: string
    time: string
}
