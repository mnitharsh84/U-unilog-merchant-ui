import { Box, Card, Flex, Text } from '@chakra-ui/react'
import { BeneficiaryDetails } from 'page-modules/return/type/return'

type params = {
    beneficiaryDetails: BeneficiaryDetails[]
    refundMode: string
    paymentMode: string
}
export default function PaymentDetail({ beneficiaryDetails, refundMode, paymentMode }: params) {
    return (
        beneficiaryDetails && (
            <Card flex="1">
                <Flex flex="1" p={4} flexDir="column" gap="4">
                    <Text fontWeight="bold">Payment Details</Text>
                    <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                        <Text fontSize="sm" fontWeight="bold" as="span">
                            Refund Mode:
                        </Text>
                        <Text fontSize="sm" ps={1} as="span">
                            {refundMode}
                        </Text>
                    </Box>
                    <Box flexDir="row" gap="4" style={{ display: 'flex' }}>
                        <Text fontSize="sm" fontWeight="bold" as="span">
                            Payment Mode:
                        </Text>
                        <Text fontSize="sm" ps={1} as="span">
                            {paymentMode}
                        </Text>
                    </Box>
                    {beneficiaryDetails.map((detail, index) => (
                        <Box key={index} flexDir="row" gap="4" style={{ display: 'flex' }}>
                            <Text fontWeight="bold" fontSize="sm" as="span">
                                {detail.displayName}:
                            </Text>
                            <Text fontSize="sm" style={{ wordBreak: 'break-all' }} ps={1} as="span">
                                {detail.value}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </Card>
        )
    )
}
