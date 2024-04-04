import { Box, Button, Card, Flex, Skeleton } from '@chakra-ui/react'
import { Exchange } from 'page-modules/exchange/type/exchange'
import { useState } from 'react'

import Customer from '../Customer/Customer'
import ItemDetail from '../ItemDetail/ItemDetail'

type Params = {
    returns: Exchange[]
    customer: any
    parentTabStatus: string
    requestId?: string
}

export default function Details({ returns, customer, parentTabStatus, requestId }: Params) {
    if (requestId) {
        returns = returns && returns.length ? returns.filter((returnObj) => returnObj.requestId === requestId) : []
    }
    const [displayCount, setDisplayCount] = useState(3) // Initially, display one item
    const toggleDisplay = () => {
        if (displayCount === 3) {
            setDisplayCount(returns.length) // Show all items
        } else {
            setDisplayCount(3) // Show only one item
        }
    }
    return (
        <Flex h="100%" gap="4" direction={{ base: 'column', md: 'row' }}>
            {returns && returns.length ? (
                <Box width={{ base: '100%', md: '75%' }}>
                    {returns.slice(0, displayCount).map((_return, index: number) => (
                        <Box key={index}>
                            <ItemDetail _return={_return} parentTabStatus={parentTabStatus} />
                            {/* No need to render the second ItemDetail */}
                        </Box>
                    ))}

                    {returns.length > 3 && (
                        <Box
                            mt={4}
                            flexDir="column"
                            alignItems="center"
                            justifyContent="center"
                            style={{ display: 'flex' }}
                        >
                            <Button fontSize="sm" variant="link" onClick={toggleDisplay}>
                                {returns.length <= 3
                                    ? ''
                                    : displayCount === 3
                                    ? 'Show all items of this order'
                                    : 'Show Less'}
                            </Button>
                        </Box>
                    )}
                </Box>
            ) : (
                <Box mt={4} width={{ base: '100%', md: '75%' }}>
                    <Card p={4}>
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton p={4} height="20px" width="100%" />
                    </Card>
                </Box>
            )}
            {Object.keys(customer).length !== 0 ? (
                <Box width={{ base: '100%', md: '25%' }}>
                    <Card flex="1" mt={4} p={4}>
                        <Flex gap="4" flexDir="column">
                            <Customer customer={customer}></Customer>
                            {/* <PaymentDetail mt={4} paymentData={customer}></PaymentDetail> */}
                        </Flex>
                    </Card>
                </Box>
            ) : (
                <Box mt={4} width={{ base: '100%', md: '25%' }}>
                    <Card p={4}>
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                        <Skeleton mb="4" p={4} height="20px" width="100%" />
                    </Card>
                </Box>
            )}
        </Flex>
    )
}
