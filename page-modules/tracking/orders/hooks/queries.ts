import { useQuery } from '@tanstack/react-query'
import { fetchExtendedMetadata, fetchShipmentDetails } from 'apis/get'
import { fetchShipments } from 'apis/post'
import sub from 'date-fns/sub'

import { Filters, TimelineParams } from '../types/filters'

function getTimeline(timeline: TimelineParams, from: string, to: string): { from: string; to: string } {
    switch (timeline) {
        case 'custom':
            return { from, to }
        case 'last_7_days':
            return {
                from: sub(new Date(), { days: 7 }).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0],
            }
        case 'last_month':
            return {
                from: sub(new Date(), { days: 30 }).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0],
            }
        case 'last_90_days':
            return {
                from: sub(new Date(), { days: 90 }).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0],
            }
    }
}

export function useShipments(filters: Filters) {
    return useQuery({
        queryKey: ['shipments', filters],
        queryFn: () => fetchShipments({ ...filters, ...getTimeline(filters.timeline, filters.from, filters.to) }),
        refetchOnWindowFocus: false,
        refetchInterval: (data, query) =>
            query.state.dataUpdateCount === 1 && data?.result?.refresh_required ? 100 : false,
    })
}

export function useShipmentDetails(trackingNumber: string) {
    return useQuery({
        queryKey: ['shipmentDetails', trackingNumber],
        queryFn: () => fetchShipmentDetails(trackingNumber),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}

export function useExtendedMetadata() {
    return useQuery({
        queryKey: ['extendedMetadata'],
        queryFn: fetchExtendedMetadata,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
