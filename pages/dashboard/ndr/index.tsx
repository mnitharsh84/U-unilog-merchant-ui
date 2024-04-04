import { Card, CardBody, CardHeader, Divider, HStack } from '@chakra-ui/react'
import Dashboard from 'layouts/Dashboard/Dashboard'
import NdrFunnels from 'page-modules/dashboard/ndr/components/NdrFunnels'
import { NdrReasonSplitGraph } from 'page-modules/dashboard/ndr/components/NdrReasonSplitGraph'
import NdrReasonSplitTable from 'page-modules/dashboard/ndr/components/NdrReasonSplitTable'
import { NdrStatusSplitGraph } from 'page-modules/dashboard/ndr/components/NdrStatusSplitGraph'
import NdrSuccessByCourierGraph from 'page-modules/dashboard/ndr/components/NdrSuccessByCourierGraph'
import { NdrTotalToTerminatedBar } from 'page-modules/dashboard/ndr/components/NdrTotalTerminatedCounts'
import { NdrShortSummary } from 'page-modules/dashboard/ndr/components/ShortSummary'

export default function DashboardNDR() {
    return (
        <>
            <Card>
                <CardHeader fontWeight="bold" py={3}>
                    Shipment details
                </CardHeader>
                <Divider color="gray.100" />
                <CardBody>
                    <NdrShortSummary />
                </CardBody>
            </Card>
            <Card w={`100%`} mt={4}>
                <CardHeader fontWeight="bold" py={3}>
                    NDR funnels
                </CardHeader>
                <Divider />
                <CardBody py={4}>
                    <NdrFunnels />
                </CardBody>
            </Card>
            <HStack gap={2} alignItems={'stretch'} mt={4}>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        NDR Reason Split Graph
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrReasonSplitGraph />
                    </CardBody>
                </Card>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        NDR Reason Split Table
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrReasonSplitTable />
                    </CardBody>
                </Card>
            </HStack>
            <HStack gap={2} alignItems={`stretch`} mt={4}>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        NDR status split
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrStatusSplitGraph />
                    </CardBody>
                </Card>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        Total to Terminated
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrTotalToTerminatedBar />
                    </CardBody>
                </Card>
            </HStack>
            <HStack gap={2} alignItems={`flex-start`} mt={4}>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        Success by Courier
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrSuccessByCourierGraph />
                    </CardBody>
                </Card>
                {/* <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        NDR Reason
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <NdrStatusSplitGraph />
                    </CardBody>
                </Card> */}
            </HStack>
        </>
    )
}

DashboardNDR.layout = Dashboard
