import { Card, CardBody, CardHeader, Divider, Flex, HStack } from '@chakra-ui/react'
import Dashboard from 'layouts/Dashboard/Dashboard'
import CourierSplitPie from 'page-modules/dashboard/overview/components/CourierSplitPie'
import CourierWiseReportTable from 'page-modules/dashboard/overview/components/CourierWiseReportTable'
import DeliveryPerformanceSplitPie from 'page-modules/dashboard/overview/components/DeliveryPerformanceSplitPie'
import ShortSummaryNDR from 'page-modules/dashboard/overview/components/ShortSummaryNDR'
import ShortSummaryShipments from 'page-modules/dashboard/overview/components/ShortSummaryShipments'
import StateMap from 'page-modules/dashboard/overview/components/StateMap'
import StatusSplitPie from 'page-modules/dashboard/overview/components/StatusSplitPie'

export default function DashboardOverview() {
    return (
        <>
            <Card w={`100%`} mt={4}>
                <CardHeader fontWeight="bold" py={3}>
                    Shipment Details
                </CardHeader>
                <Divider />
                <CardBody py={4}>
                    <ShortSummaryShipments />
                </CardBody>
            </Card>
            <Card w={`100%`} mt={4}>
                <CardHeader fontWeight="bold" py={3}>
                    NDR Details
                </CardHeader>
                <Divider />
                <CardBody py={4}>
                    <ShortSummaryNDR />
                </CardBody>
            </Card>
            <HStack gap={2} mt={4}>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        Overall Shipment Status
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <StatusSplitPie />
                    </CardBody>
                </Card>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        Delivery Performance
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <DeliveryPerformanceSplitPie />
                    </CardBody>
                </Card>
            </HStack>
            <HStack gap={2} mt={4} align="stretch">
                <Flex gap={4} flexWrap={`wrap`} flexBasis={`25%`}>
                    <StateMap />
                </Flex>
                <Card w={`100%`}>
                    <CardHeader py={3} fontWeight="bold">
                        Couriers Split
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <CourierSplitPie />
                    </CardBody>
                </Card>
            </HStack>
            <Card w={`100%`} mt={4}>
                <CardHeader py={3} fontWeight="bold">
                    Shipment Overview By Courier
                </CardHeader>
                <Divider />
                <CardBody>
                    <CourierWiseReportTable />
                </CardBody>
            </Card>
        </>
    )
}

DashboardOverview.layout = Dashboard
