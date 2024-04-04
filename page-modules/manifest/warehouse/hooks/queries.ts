import { useQuery } from '@tanstack/react-query'
import { getWarehouse, getWarehouseList } from 'apis/manifest/get'

export function useWarehouseList() {
    return useQuery({
        queryKey: ['warehouse-list'],
        queryFn: getWarehouseList,
        refetchOnWindowFocus: false,
    })
}

export function useWarehouse(warehouseCode: string) {
    return useQuery({
        queryKey: ['get-warehouse', warehouseCode],
        queryFn: () => getWarehouse(warehouseCode),
        enabled: !!warehouseCode,
    })
}
