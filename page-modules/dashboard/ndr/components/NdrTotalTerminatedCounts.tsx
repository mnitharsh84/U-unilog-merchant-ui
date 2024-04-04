import { Center, Flex } from '@chakra-ui/react'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import React from 'react'
import { Bar } from 'react-chartjs-2'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrTerminatedCounts } from '../hooks/queries'
import { useTotalTerminatedBar } from '../hooks/useTotalTerminatedBar'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const options = {
    plugins: {
        title: {
            display: false,
            text: 'NDR Status',
        },
    },
    responsive: true,
    scales: {
        x: {
            outerWidth: '0px',
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
    maintainAspectRatio: false,
}

export function NdrTotalToTerminatedBar() {
    const { startDate, endDate } = useToolbarContext()

    const { data, isLoading, isError } = useNdrTerminatedCounts(startDate, endDate)

    const barData = useTotalTerminatedBar(data)

    if (isLoading)
        return (
            <Center h={`300px`}>
                <Loading />
            </Center>
        )

    if (isError)
        return (
            <Center>
                <ErrorPlaceholder />
            </Center>
        )

    return (
        <Flex h={`300px`}>
            <Bar options={options} data={barData} />
        </Flex>
    )
}
