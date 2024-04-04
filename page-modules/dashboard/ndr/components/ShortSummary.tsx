import { HStack, Stat, StatGroup, StatLabel, StatNumber } from '@chakra-ui/react'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import React from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrShortSummary } from '../hooks/queries'

export function NdrShortSummary() {
    const { startDate, endDate } = useToolbarContext()

    const { data, isLoading, isError } = useNdrShortSummary(startDate, endDate)

    if (isLoading) {
        return (
            <HStack justify={`center`} minH={16}>
                <Loading />
            </HStack>
        )
    }

    if (isError) {
        return (
            <HStack justify={`center`}>
                <ErrorPlaceholder />
            </HStack>
        )
    }

    return (
        <StatGroup>
            {data.summary_items.map((item, i) => {
                return (
                    <Stat key={i} textAlign={`center`}>
                        <StatLabel>{item.title}</StatLabel>
                        <StatNumber>{item.value}</StatNumber>
                    </Stat>
                )
            })}
        </StatGroup>
    )
}
