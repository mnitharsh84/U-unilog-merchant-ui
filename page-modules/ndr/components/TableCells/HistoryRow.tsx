import { Center, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import { Step, Steps } from 'chakra-ui-steps'
import { useHistory } from 'page-modules/ndr/hooks/queries'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

type Props = {
    id: string
}

export default function HistoryRow({ id }: Props) {
    const { data, isLoading, isError } = useHistory(id)

    if (isLoading)
        return (
            <Center h={'200px'}>
                <Loading />
            </Center>
        )

    if (isError)
        return (
            <Center h={'200px'}>
                <ErrorPlaceholder />
            </Center>
        )

    return (
        <>
            <Tabs>
                <TabList>
                    {Object.keys(data.historyData).map((key, index) => (
                        <Tab key={index} fontSize="xs">
                            {key}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels>
                    {Object.keys(data.historyData).map((key, index) => {
                        const steps = data.historyData[key]

                        return (
                            <TabPanel key={index} backgroundColor={'white'}>
                                <Steps orientation="vertical" activeStep={9} size="small" variant="simple">
                                    {steps.map((step, index) => (
                                        <Step
                                            key={index}
                                            label={
                                                <Flex alignItems={'center'}>
                                                    <Flex flexDir={'column'} alignItems={'flex-start'} w={'250px'}>
                                                        <Text fontSize="xs" fontWeight={'bold'} color="gray.800">
                                                            {step.action}
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="normal">
                                                            {step.date}
                                                        </Text>
                                                    </Flex>
                                                    <Flex flexDir={'column'} alignItems={'flex-start'} w={'250px'}>
                                                        <Text fontSize="xs" fontWeight={'bold'} color="gray.800">
                                                            Action By
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="normal">
                                                            {step.action_by}
                                                        </Text>
                                                    </Flex>
                                                    <Flex flexDir={'column'} alignItems={'flex-start'} w={'250px'}>
                                                        <Text fontSize="xs" fontWeight={'bold'} color="gray.800">
                                                            Details
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="normal">
                                                            Reason: {step.reason}
                                                        </Text>
                                                    </Flex>
                                                    <Flex flexDir={'column'} alignItems={'flex-start'} w={'250px'}>
                                                        <Text fontSize="xs" fontWeight={'bold'} color="gray.800">
                                                            Source
                                                        </Text>
                                                        <Text fontSize="xs" fontWeight="normal">
                                                            {step.source}
                                                        </Text>
                                                    </Flex>
                                                </Flex>
                                            }
                                        ></Step>
                                    ))}
                                </Steps>
                            </TabPanel>
                        )
                    })}
                </TabPanels>
            </Tabs>
        </>
    )
}
