import { Center, Flex, Icon, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { initLogout } from 'apis/get'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { BiErrorAlt } from 'react-icons/bi'
import { CgSpinner } from 'react-icons/cg'

import styles from './grant.module.scss'

export default function AuthGrant() {
    const router = useRouter()
    const [hasError] = useState(false)

    const { data } = useQuery({
        queryKey: ['initLogout'],
        queryFn: () => initLogout(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })

    useEffect(() => {
        if (data?.code === 80000) {
            Cookies.remove('JWT-TOKEN')
            router.push(process.env.NEXT_PUBLIC_HOME_ROUTE ?? 'https://unilog.unicommerce.com/admin')
        }
    }, [data])

    return (
        <>
            <Center w={`100%`} h="100dvh">
                <Flex flexDir="column" gap={4} align="center">
                    {!hasError && (
                        <>
                            <Icon
                                as={CgSpinner}
                                fontSize="32px"
                                fontWeight="normal"
                                className={styles.loadingSpinner}
                            />
                            <Text textAlign="center">Please wait while we&apos;re logging you out...</Text>
                        </>
                    )}
                    {hasError && (
                        <>
                            <Icon as={BiErrorAlt} fontSize="32px" fontWeight="normal" />
                            <Text textAlign="center">Unable to authenticate. Please try again later.</Text>
                        </>
                    )}
                </Flex>
            </Center>
        </>
    )
}
