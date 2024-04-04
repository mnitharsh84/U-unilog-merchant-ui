import { Flex, Icon, Text } from '@chakra-ui/react'
import { AiOutlineWarning } from 'react-icons/ai'

export default function ErrorPlaceholder({ message }: { message?: string }) {
    return (
        <Flex flexDir="column" gap={4} align="center">
            <Icon as={AiOutlineWarning} fontSize="32px" fontWeight="normal" />
            <Text textAlign="center">{message ?? `Something went wrong. Please try again later.`}</Text>
        </Flex>
    )
}
