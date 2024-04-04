import { useQuery } from '@tanstack/react-query'
import {
    fetchOverviewCourierSplitType,
    fetchOverviewCourierWiseReport,
    fetchOverviewDeliveryPerformanceSplit,
    fetchOverviewStatusSplit,
    fetchOverviewSummary,
    fetchStateSplit,
} from 'apis/get'

export function useOverviewStateSplit() {
    return useQuery({
        queryKey: ['state-split'],
        queryFn: fetchStateSplit,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}

export function useOverviewSummary() {
    return useQuery({
        queryKey: ['overview-shipment-summary'],
        queryFn: fetchOverviewSummary,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}

export function useOverviewStatusSplit() {
    return useQuery({
        queryKey: ['overview-status-split'],
        queryFn: fetchOverviewStatusSplit,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}

export function useOverviewDeliveryPerformanceSplit() {
    return useQuery({
        queryKey: ['overview-delivery-performance-split'],
        queryFn: fetchOverviewDeliveryPerformanceSplit,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}

export function useOverviewCourierSplit() {
    return useQuery({
        queryKey: ['overview-courier-split'],
        queryFn: fetchOverviewCourierSplitType,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}

export function useOverviewCourierWiseReport() {
    return useQuery({
        queryKey: ['overview-courier-wise-report'],
        queryFn: fetchOverviewCourierWiseReport,
        refetchInterval: false,
        refetchOnWindowFocus: false,
    })
}
