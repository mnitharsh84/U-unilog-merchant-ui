import { useMutation } from '@tanstack/react-query'
import { calculateEDD } from 'apis/manifest/post'

import { CalculateEDDPayload } from '../types'

export function useMutateCalculateEDD() {
    return useMutation({
        mutationKey: ['calculate-EDD'],
        mutationFn: (payload: CalculateEDDPayload) => calculateEDD(payload),
    })
}
