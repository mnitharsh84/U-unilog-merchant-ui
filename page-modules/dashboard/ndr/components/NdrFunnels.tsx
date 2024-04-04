import {
    Center,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
} from '@chakra-ui/react'
import { NdrFunnelCountType, NdrFunnelType } from 'apis/get'
import { useToolbarContext } from 'page-modules/dashboard/ToolbarProvider'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useNdrFunnels } from '../hooks/queries'

export default function NdrFunnels() {
    const { startDate, endDate } = useToolbarContext()

    const { data, isLoading, isError } = useNdrFunnels(startDate, endDate)

    if (isLoading)
        return (
            <Center h={`200px`}>
                <Loading />
            </Center>
        )
    if (isError)
        return (
            <Center h={`200px`}>
                <ErrorPlaceholder />
            </Center>
        )

    if (!data.cycle_wise_counts.length)
        return (
            <Center h={'200px'}>
                <Text textAlign={`center`} fontSize="xs" color="gray.500">
                    No records found.
                </Text>
            </Center>
        )
    return (
        <>
            <Tabs isLazy color="gray.700">
                <TabList>
                    {data?.cycle_wise_counts.map((cycleCount: NdrFunnelCountType, idx) => {
                        return (
                            <Tab
                                key={idx}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                {cycleCount.cycle}
                            </Tab>
                        )
                    })}
                </TabList>
                <TabPanels bg="gray.100">
                    {data?.cycle_wise_counts.map((cycleCount: NdrFunnelCountType, idx) => {
                        return (
                            <TabPanel key={idx}>
                                <StatGroup flexDir="row" justifyContent="space-between" w="100%">
                                    {cycleCount.counts.map((item: NdrFunnelType, idx) => {
                                        return (
                                            <Stat key={idx}>
                                                <StatLabel textAlign={`center`}>{item.title}</StatLabel>
                                                <StatNumber textAlign={`center`}>{item.value}</StatNumber>
                                            </Stat>
                                        )
                                    })}
                                </StatGroup>
                            </TabPanel>
                        )
                    })}
                </TabPanels>
            </Tabs>
        </>
    )
}
