import { PaginationState } from '@tanstack/react-table'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { ReactNode } from 'react'
import usePagination from 'shared/hooks/usePagination'

import { CustomFilters, PageFilters, SellerReturnOrder } from './type/return'

export type Filters = {
    pageFilters: PageFilters
    setPageFilters: Dispatch<SetStateAction<PageFilters>>
    customFilters: CustomFilters
    setCustomFilters: Dispatch<SetStateAction<CustomFilters>>
    pageIndex: number
    pageSize: number
    pageCount: number
    setItems: React.Dispatch<React.SetStateAction<number>>
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>
    selectedOrder: SellerReturnOrder
    setSelectedOrder: Dispatch<SetStateAction<SellerReturnOrder>>
}

const FilterContext = React.createContext<Filters>({} as Filters)

export function useFilterContext() {
    return useContext(FilterContext)
}

export default function FilterProvider({ children }: { children: ReactNode }) {
    const [pageFilters, setPageFilters] = useState<PageFilters>({
        startDate: '',
        endDate: '',
        searchText: '',
    })
    const [customFilters, setCustomFilters] = useState<CustomFilters>({})
    const [selectedOrder, setSelectedOrder] = useState<SellerReturnOrder>({
        display_order_code: '',
        sale_order_code: '',
        customer_phone: '',
        customer_email: '',
        return_request: [],
    })

    const { pageIndex, pageSize, pageCount, setItems, setPagination } = usePagination()

    return (
        <FilterContext.Provider
            value={{
                pageFilters,
                setPageFilters,
                customFilters,
                setCustomFilters,
                pageIndex,
                pageSize,
                pageCount,
                setItems,
                setPagination,
                selectedOrder,
                setSelectedOrder,
            }}
        >
            {children}
        </FilterContext.Provider>
    )
}
