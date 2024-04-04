import { useQuery } from '@tanstack/react-query'
import { fetchExportProgress, fetchImportProgress } from 'apis/get'

export function useExportProgress() {
    return useQuery({
        queryKey: ['export-progress'],
        queryFn: fetchExportProgress,
        enabled: false,
    })
}

export function useImportProgress() {
    return useQuery({
        queryKey: ['import-progress'],
        queryFn: fetchImportProgress,
        enabled: false,
    })
}
