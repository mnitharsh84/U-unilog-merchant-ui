import { Box, CardBody, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterProvider from 'page-modules/buyer/FilterProvider'
import FilterBar from 'page-modules/buyer/components/FilterBar/FilterBar'
import FilterStatus from 'page-modules/buyer/components/FilterStatus/FilterStatus'
import PaginationBar from 'page-modules/buyer/components/PaginationBar/PaginationBar'
import React, { ReactNode, useEffect, useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

import styles from '../shared/layout.module.scss'
import { BUYER_ROUTE_MAP, BUYER_ROUTE_PATH } from './Buyer-route-map'

type TabMenu = {
    name: string
    url: string
}
const TABMENUS: TabMenu[] = [
    {
        name: 'Reattempt',
        url: '/buyer/reattempt',
    },
    {
        name: 'RTO',
        url: '/buyer/rto',
    },
]

export default function BuyerLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [tabIndex, setTabIndex] = useState<number>(0)
    let tabMenus: TabMenu[] = []
    // tabMenus = setTabMenus(TABMENUS, allowedURLs);
    tabMenus = TABMENUS
    useEffect(() => {
        const tabName: BUYER_ROUTE_PATH = router.pathname.split('/').at(-1) as BUYER_ROUTE_PATH
        console.log(tabName)
        setTabIndex(BUYER_ROUTE_MAP[tabName].index)
    }, [router.pathname])

    return (
        <FilterProvider>
            <PageCard
                title="Buyer Requests"
                toolbar={
                    <Box ml={4} pt={1} paddingBottom={4} overflowX={'auto'} overflowY={'hidden'} h={'100%'}>
                        <FilterBar tabIndex={tabIndex} />
                    </Box>
                }
            >
                <CardBody h={'100%'} pt={2}>
                    <FilterStatus />
                    <Tabs
                        isLazy
                        className={styles.tabsContainer}
                        color="gray.700"
                        index={tabIndex}
                        onChange={setTabIndex}
                        h={'100%'}
                        borderBottom={0}
                    >
                        <TabList h={'auto'} className={styles.tabList}>
                            {tabMenus.map((tabMenu, index) => (
                                <Tab
                                    key={index}
                                    className={styles.returnExchangeTab}
                                    fontSize="sm"
                                    _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                    fontWeight="bold"
                                >
                                    <Link href={tabMenu.url}>
                                        <Text paddingBlock={2} paddingInline={4}>
                                            {tabMenu.name}
                                        </Text>
                                    </Link>
                                </Tab>
                            ))}

                            <Flex
                                ml={'auto'}
                                overflowX={'auto'}
                                overflowY={'hidden'}
                                h={'100%'}
                                alignItems={'center'}
                                gap={1}
                            >
                                <PaginationBar />
                                {/* <TableActionsMenu /> */}
                            </Flex>
                        </TabList>

                        <Box className={styles.returnExchangeTab} h={'calc(100% - 5rem)'}>
                            <Box overflow={'auto'} h={'100%'} className={styles.scrollShadows} zIndex={10}>
                                {children}
                            </Box>
                        </Box>
                    </Tabs>
                </CardBody>
            </PageCard>
        </FilterProvider>
    )
}
