import { useQuery } from '@tanstack/react-query'
import { fetchMetadata } from 'apis/get'

export function useMetadata() {
    return useQuery({
        queryKey: ['metadata'],
        queryFn: fetchMetadata,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
