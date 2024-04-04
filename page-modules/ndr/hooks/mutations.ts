import { useMutation } from '@tanstack/react-query'
import { NdrTabStatus, initiateDatatableExport } from 'apis/get'
import {
    FakeAttemptNDRType,
    ReattemptNDRType,
    RtoNDRType,
    fakeAttemptNDR,
    patchCommunicationChannelConfiguration,
    patchCommunicationChannelConfigurationEvent,
    patchCommunicationChannelTemplate,
    reattemptNDR,
    rtoNDR,
} from 'apis/post'

import { useFilterContext } from '../FilterProvider'

export function useMutateReattempt() {
    return useMutation({
        mutationKey: ['mutate-reattempt'],
        mutationFn: (payload: ReattemptNDRType) => reattemptNDR(payload),
    })
}

export function useMutateRTO() {
    return useMutation({
        mutationKey: ['mutate-rto'],
        mutationFn: (payload: RtoNDRType) => rtoNDR(payload),
    })
}

export function useMutateNdrExport() {
    const { pageFilters, customFilters } = useFilterContext()
    return useMutation({
        mutationKey: ['mutate-ndr-export'],
        mutationFn: (tabStatus: NdrTabStatus) =>
            initiateDatatableExport({
                is_web: true,
                status: tabStatus,
                query_string: pageFilters.searchText,
                from: pageFilters.startDate,
                to: pageFilters.endDate,
                ndr_status: pageFilters.ndrReasons,
                shipping_provider_code: pageFilters.shippingProviders,
                customFilters,
            }),
    })
}

export function useMutateFakeAttempt() {
    return useMutation({
        mutationKey: ['mutate-fake-attempt'],
        mutationFn: (payload: FakeAttemptNDRType) => fakeAttemptNDR(payload),
    })
}

export function UseMutationCommunicationChannelConfiguration(url: string) {
    return useMutation({
        mutationKey: ['mutate-communication-channel-config'],
        mutationFn: (payload: any) => patchCommunicationChannelConfiguration(url, payload),
    })
}

export function UseMutationCommunicationChannelConfigurationEvent(url: string) {
    return useMutation({
        mutationKey: ['mutate-communication-channel-event-config'],
        mutationFn: (payload: any) => patchCommunicationChannelConfigurationEvent(url, payload),
    })
}

export function UseMutationCommunicationChannelTemplate(url: string) {
    return useMutation({
        mutationKey: ['mutate-communication-template-config'],
        mutationFn: (payload: any) => patchCommunicationChannelTemplate(url, payload),
    })
}
