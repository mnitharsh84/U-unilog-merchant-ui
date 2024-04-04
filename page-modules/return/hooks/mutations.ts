import { useMutation } from '@tanstack/react-query'
import {
    postChangeStateAction,
    postMarkRefundComplete,
    postReturnOrderAction,
    putRmsReason,
    putSetupPolicy,
} from 'apis/post'
import { convertToExchangePostAction } from 'apis/return/post'

import { ConvertExchangePayload } from '../type/return'

export function UseMutationSetupPolicy(url: string) {
    return useMutation({
        mutationKey: ['mutate-setup-policy'],
        mutationFn: (payload: any) => putSetupPolicy(url, payload),
    })
}
export function useMutationRmsReason(url: string) {
    return useMutation({
        mutationKey: ['mutate-rms-reason'],
        mutationFn: (payload: any) => putRmsReason(url, payload),
    })
}

export function UseMutationReturnOrderAction(url: string) {
    return useMutation({
        mutationKey: ['mutate-return-order-action'],
        mutationFn: (payload: any) => postReturnOrderAction(url, payload),
    })
}

export function useMutationChangeStateAction(url: string) {
    return useMutation({
        mutationKey: ['mutate-change-state-action'],
        mutationFn: (payload: any) => postChangeStateAction(url, payload),
    })
}

export function useMutationMarkRefundComplete(url: string) {
    return useMutation({
        mutationKey: ['mark-refund-complete'],
        mutationFn: (payload: any) => postMarkRefundComplete(url, payload),
    })
}

export function useMutationConvertChange(url: string) {
    return useMutation({
        mutationKey: ['mutate-convert-change'],
        mutationFn: (payload: ConvertExchangePayload) => convertToExchangePostAction(url, payload),
    })
}
