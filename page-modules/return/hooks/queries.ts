import { useQuery } from '@tanstack/react-query'
import { fetchShippingProviders } from 'apis/get'
import { getSetupPolicy } from 'apis/get'
import { getWarehouseList } from 'apis/manifest/get'
import { fetchSellerReturnData } from 'apis/return/get'

import { useFilterContext } from '../FilterProvider'
import { SetupPolicy } from '../components/setup/type/setup'
import { PageFilters, RMSTYPE, ReturnTabStatus } from '../type/return'

export function useSellerReturnData(
    tabStatus: ReturnTabStatus,
    rmsType: RMSTYPE,
    customFilters: any,
    pageFilters: PageFilters,
) {
    const { pageIndex, pageSize } = useFilterContext()
    return useQuery({
        queryKey: ['seller-return', pageFilters, customFilters, tabStatus, pageIndex, pageSize],
        queryFn: () =>
            fetchSellerReturnData({
                page: pageIndex,
                page_size: pageSize,
                is_web: true,
                query_string: pageFilters.searchText,
                from: pageFilters.startDate,
                to: pageFilters.endDate,
                rms_page: tabStatus,
                rms_type: rmsType,
                customFilters,
            }),
        refetchOnWindowFocus: false,
        enabled: !!pageFilters.startDate && !!pageFilters.endDate && !!tabStatus,
    })
}

export function useShippingProviders() {
    return useQuery({
        queryKey: ['shipping-providers'],
        queryFn: fetchShippingProviders,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}
export function useRmsReturnPolicyData(url: string, onSuccess: (data: SetupPolicy) => void) {
    return useQuery({
        queryKey: ['get-rms-return-policy'],
        queryFn: () => getSetupPolicy(url),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: onSuccess,
    })
}

export function useWarehouseList() {
    return useQuery({
        queryKey: ['warehouse-list'],
        queryFn: getWarehouseList,
        refetchOnWindowFocus: false,
    })
}
