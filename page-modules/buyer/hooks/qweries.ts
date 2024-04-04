import { useQuery } from '@tanstack/react-query'
import { fetchBuyerRequestsData } from 'apis/buyerRequest/get'
import { CustomFilters } from 'shared/types/tabs'

import { useFilterContext } from '../FilterProvider'
import { BuyerTabStatus, PageFilters } from '../types/buyer'

export function useBuyerRequestData(tabStatus: BuyerTabStatus, customFilters: CustomFilters, pageFilters: PageFilters) {
    const { pageIndex, pageSize } = useFilterContext()
    return useQuery({
        queryKey: ['buyer-requests', pageFilters, customFilters, tabStatus, pageIndex, pageSize],
        queryFn: () =>
            fetchBuyerRequestsData({
                page: pageIndex,
                page_size: pageSize,
                is_web: true,
                query_string: pageFilters.searchText,
                from: pageFilters.startDate,
                to: pageFilters.endDate,
                ndr_action: tabStatus,
                customFilters,
            }),
        refetchOnWindowFocus: false,
        enabled: !!pageFilters.startDate && !!pageFilters.endDate && !!tabStatus,
    })
}
