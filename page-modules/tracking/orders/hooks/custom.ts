import { useEffect, useState } from 'react'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { Filters } from '../types/filters'
import { INIT_DEFAULT_FILTER_VALUES } from '../utils'

export function useDeviations(filters: Filters): number {
    const [deviations, setDeviations] = useState<number>(0)

    useEffect(() => {
        let updatedDeviations = 0

        if (filters.timeline !== INIT_DEFAULT_FILTER_VALUES.timeline) ++updatedDeviations
        if (filters.sortBy !== INIT_DEFAULT_FILTER_VALUES.sortBy) ++updatedDeviations
        if (JSON.stringify(filters.filterBy) !== JSON.stringify(INIT_DEFAULT_FILTER_VALUES.filterBy))
            ++updatedDeviations

        Object.keys(filters.customFilters).forEach((filterKey) => {
            if (
                JSON.stringify(filters.customFilters[filterKey].value) !==
                JSON.stringify(INIT_VALUE_MAP[filters.customFilters[filterKey].type])
            )
                ++updatedDeviations
        })

        setDeviations(updatedDeviations)
    }, [filters])

    return deviations
}
