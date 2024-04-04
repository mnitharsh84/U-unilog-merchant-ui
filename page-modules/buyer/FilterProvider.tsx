import { PaginationState } from '@tanstack/react-table'
import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { ReactNode } from 'react'
import usePagination from 'shared/hooks/usePagination'
import { CustomFilters } from 'shared/types/tabs'

import { PageFilters } from './types/buyer'

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
            }}
        >
            {children}
        </FilterContext.Provider>
    )
}
