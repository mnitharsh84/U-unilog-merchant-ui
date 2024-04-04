import { Box, Center, Divider, Flex, Text } from '@chakra-ui/react'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'
import { parseDate } from 'shared/utils/functions'

import { useShipmentDetails } from '../hooks/queries'

type Props = {
    trackingNumber: string
}

export default function ShipmentDetail({ trackingNumber }: Props) {
    const { isLoading, isError, data } = useShipmentDetails(trackingNumber)

    if (isLoading)
        return (
            <Center h="100%">
                <Loading />
            </Center>
        )
    if (isError)
        return (
            <Center h="100%">
                <ErrorPlaceholder />
            </Center>
        )

    const orderItemsColumns = {
        sku: 'SKU',
        channelProduct: 'Channel Product',
        totalCost: 'Total Cost',
    }

    const trackingEventsColumns = {
        date: 'Date',
        status: 'Status',
        location: 'Location',
    }

    const orderItemsData: { [key in keyof typeof orderItemsColumns]: { value: string; align: 'left' | 'right' } }[] =
        data.result?.tracking_details?.line_items?.map((lineItem) => {
            return {
                sku: { value: lineItem.seller_sku_code, align: 'left' },
                channelProduct: { value: lineItem.channel_product_name, align: 'left' },
                totalCost: { value: lineItem.total_price, align: 'left' },
            }
        }) || []

    const trackingEventsData: {
        [key in keyof typeof trackingEventsColumns]: { value: string; align: 'left' | 'right' }
    }[] =
        data.result?.tracking_details?.tracking_events?.map((trackingEvent) => {
            return {
                date: { value: trackingEvent.tracking_datetime || '-', align: 'left' },
                status: { value: trackingEvent.tracking_status || '-', align: 'left' },
                location: { value: trackingEvent.tracking_location || '-', align: 'left' },
            }
        }) || []

    return (
        <>
            <Text fontSize="md" mb={4}>
                Basic Information
            </Text>
            <Flex justifyContent="space-between" mb={3}>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Tracking Number
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.tracking_number || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Sale Order
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.order_number || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Shipping Package
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.shipping_package_code || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Tracking Status
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.current_wismo_display_status || '-'}
                    </Text>
                </Box>
            </Flex>

            <Flex justifyContent="space-between" mb={3}>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Courier
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.shipping_source_code || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Shipping Method Type
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.shipping_type || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Payment Method
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.payment_method || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Number of Items
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.no_of_items || '-'}
                    </Text>
                </Box>
            </Flex>

            <Flex justifyContent="space-between" mb={3}>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Date of Order
                    </Text>
                    <Text className="value" fontSize="sm">
                        {parseDate(data.result.tracking_details.order_datetime) || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Date of Dispatch
                    </Text>
                    <Text className="value" fontSize="sm">
                        {parseDate(data.result.tracking_details.dispatch_datetime) || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Date of Expected Delivery
                    </Text>
                    <Text className="value" fontSize="sm">
                        {parseDate(data.result.tracking_details.expected_delivered_datetime) || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Date of Delivery
                    </Text>
                    <Text className="value" fontSize="sm">
                        {parseDate(data.result.tracking_details.delivered_datetime) || '-'}
                    </Text>
                </Box>
            </Flex>

            <Flex justifyContent="space-between" mb={3}>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Shipment Total Cost
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.total_price || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Customer Name
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.customer_name || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Customer Phone
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.customer_phone || '-'}
                    </Text>
                </Box>
                <Box className="container" w={`25%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Customer Email
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.customer_email || '-'}
                    </Text>
                </Box>
            </Flex>
            <Flex justifyContent={`flex-start`} mb={4}>
                <Box className="container" w={`100%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Customer Address
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.delivery_address || '-'}
                    </Text>
                </Box>
            </Flex>
            <Flex justifyContent={`flex-start`} mb={4}>
                <Box className="container" w={`100%`} p={0}>
                    <Text className="key" fontSize="xs" color="gray.600">
                        Customer Latest Feedback
                    </Text>
                    <Text className="value" fontSize="sm">
                        {data.result.tracking_details.customer_feedback || '-'}
                    </Text>
                </Box>
            </Flex>
            <Divider mb={4} />

            <Text fontSize="md" mb={4}>
                Order Items{' '}
            </Text>
            <Box border={`1px solid var(--chakra-colors-gray-200)`}>
                <ChakraTable<typeof orderItemsColumns> columns={orderItemsColumns} data={orderItemsData} />
            </Box>

            <Divider my={4} />

            <Text fontSize="md" mb={4}>
                Tracking Events
            </Text>
            <Box border={`1px solid var(--chakra-colors-gray-200)`}>
                <ChakraTable<typeof trackingEventsColumns> columns={trackingEventsColumns} data={trackingEventsData} />
            </Box>
        </>
    )
}
