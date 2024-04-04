import { NdrFilter } from 'apis/get'
import { useEffect, useState } from 'react'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { CustomFilters } from '../types/filters'

export default function useDeviations(customFilters: CustomFilters, tabFilters: NdrFilter[] | undefined) {
    const [deviations, setDeviations] = useState<number>(0)

    useEffect(() => {
        let updatedDeviations = 0
        Object.keys(customFilters)
            .filter((filterKey) => tabFilters?.some((tabFilter) => tabFilter.key === filterKey))
            .forEach((filterKey) => {
                if (
                    JSON.stringify(customFilters[filterKey].value) !==
                    JSON.stringify(INIT_VALUE_MAP[customFilters[filterKey].type])
                )
                    ++updatedDeviations
            })

        setDeviations(updatedDeviations)
    }, [customFilters, tabFilters])

    return deviations
}
