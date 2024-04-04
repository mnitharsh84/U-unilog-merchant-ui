import { Box, Card, Flex, Text } from '@chakra-ui/react'

export default function Customer({ customer }: any) {
    return (
        customer && (
            <>
                <Card flex="1">
                    <Flex flex="1" p={4} flexDir="column" gap="4">
                        <Text fontWeight="bold">{`Customer's Pickup Address`}</Text>
                        {customer.pickupAddress.name && (
                            <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                                <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                    {customer.pickupAddress.name}
                                </Text>
                            </Box>
                        )}
                        {customer.pickupAddress.email && (
                            <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                                <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                    {customer.pickupAddress.email}
                                </Text>
                            </Box>
                        )}
                        {customer.pickupAddress.phone && (
                            <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                                <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                    {customer.pickupAddress.phone}
                                </Text>
                            </Box>
                        )}
                        {customer.pickupAddress?.addressLine1 && (
                            <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                                <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                    {customer.pickupAddress.addressLine1}
                                </Text>
                            </Box>
                        )}
                        {customer.pickupAddress?.addressLine2 && (
                            <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                                <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                    {customer.pickupAddress.addressLine2}
                                </Text>
                            </Box>
                        )}
                        <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                            <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                {customer.pickupAddress?.city}, {customer.pickupAddress?.state},{' '}
                                {customer.pickupAddress?.pincode}
                            </Text>
                        </Box>
                        <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                            <Text fontSize="sm" style={{ overflow: 'hidden' }}>
                                {customer.pickupAddress?.country}
                            </Text>
                        </Box>
                    </Flex>
                </Card>
            </>
        )
    )
}
