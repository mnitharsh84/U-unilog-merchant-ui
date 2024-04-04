import DomainHandler from 'apis/domain-handler'
import gateway from 'apis/gateway'
import { WarehouseData } from 'page-modules/manifest/warehouse/types/warehouse'

import { URLs } from './urls'

const domainHandler = new DomainHandler()

export type GetWarehouseListResponse = {
    warehouseList: WarehouseData[]
}
export async function getWarehouseList(): Promise<GetWarehouseListResponse> {
    return await gateway(URLs.getWarehouseList, { method: 'GET' })
}

export async function getWarehouse(warehouseCode: string): Promise<WarehouseData> {
    return await gateway(`${URLs.getWarehouse}?warehouse_code=${domainHandler.encodeUriParams(warehouseCode)}`, {
        method: 'GET',
    })
}
