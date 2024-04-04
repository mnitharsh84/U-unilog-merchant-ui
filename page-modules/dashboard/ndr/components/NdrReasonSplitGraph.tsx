import { Center, Flex, Text } from '@chakra-ui/react'
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import { Doughnut } from 'react-chartjs-2'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrReason } from '../hooks/queries'
import { useReasonSplitGraph } from '../hooks/useReasonSplitGraph'

ChartJS.register(ArcElement, Tooltip, Legend)

const options: {
    animation: {
        duration: number
    }
    maintainAspectRatio: boolean
} = {
    animation: {
        duration: 500,
    },
    maintainAspectRatio: false,
}

export function NdrReasonSplitGraph() {
    const { startDate, endDate } = useToolbarContext()

    const { data, isLoading, isError } = useNdrReason(startDate, endDate)

    const graphData = useReasonSplitGraph(data)

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

    if (!data.pie_chart.length)
        return (
            <Center h={'300px'}>
                <Text textAlign={`center`} fontSize="xs" color="gray.500">
                    No records found.
                </Text>
            </Center>
        )

    return (
        <Flex h={`300px`} justify="center">
            <Doughnut data={graphData} options={options} width="100%" />
        </Flex>
    )
}
