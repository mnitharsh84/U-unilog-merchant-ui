import { Card, CardHeader, Divider, Heading, Text } from '@chakra-ui/react'

export default function CompanyProfile() {
    return (
        <Card w={`100%`} variant="outline">
            <CardHeader>
                <Heading size="md" color="gray.900">
                    Company Profile
                </Heading>
                <Text as="p" fontSize="xs" color="gray.500" mt={2}>
                    Overview your configurations across UniShip. Select a category to begin.
                </Text>
            </CardHeader>
            <Divider />
        </Card>
    )
}
