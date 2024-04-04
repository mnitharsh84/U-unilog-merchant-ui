import { useQuery } from '@tanstack/react-query'
import { fetchSellerExchnageData } from 'apis/exchange/get'
import { getSetupPolicy } from 'apis/get'

import { useFilterContext } from '../FilterProvider'
import { SetupPolicy } from '../components/setup/type/setup'
import { CustomFilters, ExchangeTabStatus, PageFilters, RMSTYPE } from '../type/exchange'

export function useSellerExchangeData(
    tabStatus: ExchangeTabStatus,
    rmsType: RMSTYPE,
    customFilters: CustomFilters,
    pageFilters: PageFilters,
) {
    const { pageIndex, pageSize } = useFilterContext()
    return useQuery({
        queryKey: ['seller-exchange', pageFilters, customFilters, tabStatus, pageIndex, pageSize],
        queryFn: () =>
            fetchSellerExchnageData({
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

export function useRmsExchangePolicyData(url: string, onSuccess: (data: SetupPolicy) => void) {
    return useQuery({
        queryKey: ['get-rms-exchange-policy'],
        queryFn: () => getSetupPolicy(url),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        onSuccess: onSuccess,
    })
}
