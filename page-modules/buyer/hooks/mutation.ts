import { useMutation } from '@tanstack/react-query'
import { patchRequest, postRequest } from 'apis/buyerRequest/post'

export function UseMutationBuyerNdrRequest(url: string) {
    return useMutation({
        mutationKey: ['mutate-buyer-ndr-request'],
        mutationFn: (payload: any) => postRequest(url, payload),
    })
}
export function UseMutationBuyerNdrRequestDiscared(url: string) {
    return useMutation({
        mutationKey: ['mutate-buyer-ndr-request-discarded'],
        mutationFn: (payload: any) => patchRequest(url, payload),
    })
}
