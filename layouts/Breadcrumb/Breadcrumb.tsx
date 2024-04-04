import { ChevronRightIcon } from '@chakra-ui/icons'
import { Breadcrumb, BreadcrumbItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

import { useBreadcrumbs } from './hooks'

export default function BreadcrumbComp() {
    const router = useRouter()
    const breadcrumbs = useBreadcrumbs(router)

    return (
        <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            {breadcrumbs.map((el, i) => {
                return (
                    <BreadcrumbItem key={i}>
                        <Link href={el.href}>
                            <Text as="span" color={i == breadcrumbs.length - 1 ? '' : 'blue.600'} fontSize="sm">
                                {el.title}
                            </Text>
                        </Link>
                    </BreadcrumbItem>
                )
            })}
        </Breadcrumb>
    )
}
