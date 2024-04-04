import { useMutation } from '@tanstack/react-query'
import { createWarehouse, updateWarehouse } from 'apis/manifest/post'

import { WarehouseData } from '../types/warehouse'

export function useMutateCreateWarehouse() {
    return useMutation({
        mutationKey: ['create-warehouse'],
        mutationFn: (payload: WarehouseData) => createWarehouse(payload),
    })
}

export function useMutateUpdateWarehouse() {
    return useMutation({
        mutationKey: ['update-warehouse'],
        mutationFn: (payload: WarehouseData) => updateWarehouse(payload),
    })
}
