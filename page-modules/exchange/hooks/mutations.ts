import { useMutation } from '@tanstack/react-query'
import { postChangeStateAction, postMarkRefundComplete, postReturnOrderAction, putSetupPolicy } from 'apis/post'

export function UseMutationSetupPolicy(url: string) {
    return useMutation({
        mutationKey: ['mutate-setup-policy'],
        mutationFn: (payload: any) => putSetupPolicy(url, payload),
    })
}
export function UseMutationReturnOrderAction(url: string) {
    return useMutation({
        mutationKey: ['mutate-exchange-order-action'],
        mutationFn: (payload: any) => postReturnOrderAction(url, payload),
    })
}

export function useMutationChangeStateAction(url: string) {
    return useMutation({
        mutationKey: ['mutate-exchange-state-action'],
        mutationFn: (payload: any) => postChangeStateAction(url, payload),
    })
}

export function useMutationMarkRefundComplete(url: string) {
    return useMutation({
        mutationKey: ['mark-refund-complete'],
        mutationFn: (payload: any) => postMarkRefundComplete(url, payload),
    })
}
