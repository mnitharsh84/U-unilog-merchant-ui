import { Box, Text } from '@chakra-ui/react'

type ProductInfoType = {
    name: string
    price: number
    quantity: number
}
const ProductInfo = ({ name, price, quantity }: ProductInfoType) => {
    return (
        <Box flex="1">
            <Text fontSize="sm">{name}</Text>
            <Text fontSize="sm" fontWeight="bold" mt={2} mb={2}>
                <Text as="span" color="blue.500">
                    ₹{' '}
                </Text>
                {`${price} * ${quantity}`}
            </Text>
        </Box>
    )
}

export default ProductInfo
