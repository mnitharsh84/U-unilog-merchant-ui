import { Box, CardBody, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterProvider from 'page-modules/exchange/FilterProvider'
import FilterBar from 'page-modules/exchange/components/FilterBar/FilterBar'
import FilterStatus from 'page-modules/exchange/components/FilterStatus/FilterStatus'
import PaginationBar from 'page-modules/exchange/components/PaginationBar/PaginationBar'
import React, { ReactNode, useEffect, useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

import styles from '../shared/layout.module.scss'
import { EXCHANGE_ROUTE_MAP, EXCHANGE_ROUTE_PATH } from './Exchange-route-map'

type TabMenu = {
    name: string
    url: string
}
const TABMENUS: TabMenu[] = [
    {
        name: 'Requested',
        url: '/exchanges/requested',
    },
    {
        name: 'Approved',
        url: '/exchanges/approved',
    },
    {
        name: 'Rejected',
        url: '/exchanges/rejected',
    },
    {
        name: 'Exchanged',
        url: '/exchanges/exchanged',
    },
    {
        name: 'Deleted',
        url: '/exchanges/deleted',
    },
]
// const setTabMenus = (tabMenus: TabMenu[], allowedURLs: string[] | null) => {
//     let allowedTabMenus: TabMenu[] = []
//     if (allowedURLs) {
//         if (allowedURLs && allowedURLs.includes('/all_urls')) {
//             allowedTabMenus = tabMenus
//         } else {
//             tabMenus.map((tabMenu: TabMenu) => {
//                 if (allowedURLs.includes(tabMenu.url)) {
//                     allowedTabMenus.push(tabMenu)
//                 }
//             })
//         }
//     }

//     return allowedTabMenus
// }
export default function ExchangeLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [tabIndex, setTabIndex] = useState<number>(0)
    let tabMenus: TabMenu[] = []
    // tabMenus = setTabMenus(TABMENUS, allowedURLs);
    tabMenus = TABMENUS
    useEffect(() => {
        const tabName: EXCHANGE_ROUTE_PATH = router.pathname.split('/').at(-1) as EXCHANGE_ROUTE_PATH
        setTabIndex(EXCHANGE_ROUTE_MAP[tabName].index)
    }, [router.pathname])

    return (
        <FilterProvider>
            <PageCard
                title="Exchanges"
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

                        <Box className={styles.tabPanel} h={'calc(100% - 5rem)'}>
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
