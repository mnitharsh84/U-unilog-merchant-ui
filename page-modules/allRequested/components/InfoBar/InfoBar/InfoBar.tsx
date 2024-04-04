import { InfoOutlineIcon } from '@chakra-ui/icons'
import { Flex, Icon, Text } from '@chakra-ui/react'

// Import the InfoOutlineIcon

const InfoBar = ({ info }: any) => {
    return (
        <Flex alignItems="center" bg="blue.100" p={2} borderRadius="md">
            <Icon as={InfoOutlineIcon} boxSize={5} color="blue.500" />
            <Text ml={2} fontSize="sm" color="blue.700">
                {info}
            </Text>
        </Flex>
    )
}

export default InfoBar
