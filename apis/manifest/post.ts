import gateway from 'apis/gateway'
import { CalculateEDDPayload, CalculateEDDResponse } from 'page-modules/manifest/edd-calculator/types'
import { WarehouseData } from 'page-modules/manifest/warehouse/types/warehouse'

import { URLs } from './urls'

type CreateWarehouseResponse = {
    message: string
    warehouse: WarehouseData
}
export async function createWarehouse(payload: WarehouseData): Promise<CreateWarehouseResponse> {
    return await gateway(URLs.createWarehouse, {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

type UpdateWarehouseResponse = {
    status: string
    message: string
    warehouse: WarehouseData
}
export async function updateWarehouse(payload: WarehouseData): Promise<UpdateWarehouseResponse> {
    return await gateway(URLs.updateWarehouse, {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}

export async function calculateEDD(payload: CalculateEDDPayload): Promise<CalculateEDDResponse> {
    return await gateway(URLs.calculateEdd, {
        method: 'POST',
        body: JSON.stringify(payload),
    })
}
