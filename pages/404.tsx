import { Center, Flex, Icon, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BiErrorAlt } from 'react-icons/bi'
import { ROUTES } from 'shared/utils/enums'

export default function FourOhFourPage() {
    return (
        <>
            <Center w={`100%`} h="100dvh">
                <Flex flexDir="column" gap={4} align="center">
                    <Icon as={BiErrorAlt} fontSize="32px" fontWeight="normal" />
                    <Text textAlign="center">
                        Uh-oh! This page doesn&apos;t seem to exist. Go{' '}
                        <Link href={ROUTES.HOME_PAGE} color="teal">
                            <Text as="span" color="blue.600">
                                Back
                            </Text>
                        </Link>
                    </Text>
                </Flex>
            </Center>
        </>
    )
}
