import { Box, Card, CardHeader, Divider, Flex, Heading, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
    title: string
    subtitle?: string
    toolbar?: ReactNode
    children: ReactNode
    cardStyles?: { [key: string]: string }
}

export default function PageCard({ title, subtitle, toolbar, children, cardStyles }: Props) {
    return (
        <Card w={`100%`} h={'100%'} variant="outline" {...cardStyles}>
            <CardHeader pb={2} height="auto">
                <Flex flexDir="row" flexWrap="wrap" align={`center`} justify={`space-between`}>
                    <Flex flexDir="column">
                        <Heading size="md" color="gray.900" minW={'max-content'}>
                            {title}
                        </Heading>
                        <Text as="p" fontSize="xs" color="gray.600" mt={2} minW={'max-content'}>
                            {subtitle}
                        </Text>
                    </Flex>
                    {toolbar}
                </Flex>
            </CardHeader>
            <Divider />
            <Box h={'calc(100% - 5rem)'}>{children}</Box>
        </Card>
    )
}
