import { useQuery } from '@tanstack/react-query'
import { fetchImportConfig, fetchImportTypes } from 'apis/import/get'

export function useImportTypes() {
    return useQuery({
        queryKey: ['import-types'],
        queryFn: () => fetchImportTypes(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}

export function useImportConfig(importType: string) {
    return useQuery({
        queryKey: ['import-config', importType],
        queryFn: () => fetchImportConfig(importType),
        enabled: !!importType,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
