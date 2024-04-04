import { Box, CardBody, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterProvider from 'page-modules/return/FilterProvider'
import FilterBar from 'page-modules/return/components/FilterBar/FilterBar'
import FilterStatus from 'page-modules/return/components/FilterStatus/FilterStatus'
import PaginationBar from 'page-modules/return/components/PaginationBar/PaginationBar'
import React, { ReactNode, useEffect, useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

import { RETURN_ROUTE_MAP, RETURN_ROUTE_PATH } from './Return-route-map'
import styles from './ReturnsLayout.module.scss'

type TabMenu = {
    name: string
    url: string
}
const TABMENUS: TabMenu[] = [
    {
        name: 'Requested',
        url: '/return/requested',
    },
    {
        name: 'Approved',
        url: '/return/approved',
    },
    {
        name: 'Rejected',
        url: '/return/rejected',
    },
    {
        name: 'Completed',
        url: '/return/completed',
    },
    {
        name: 'Deleted',
        url: '/return/deleted',
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
export default function ReturnsLayout({ children }: { children: ReactNode }) {
    const router = useRouter()
    const [tabIndex, setTabIndex] = useState<number>(0)
    let tabMenus: TabMenu[] = []
    // tabMenus = setTabMenus(TABMENUS, allowedURLs);
    tabMenus = TABMENUS
    useEffect(() => {
        const tabName: RETURN_ROUTE_PATH = router.pathname.split('/').at(-1) as RETURN_ROUTE_PATH
        setTabIndex(RETURN_ROUTE_MAP[tabName].index)
    }, [router.pathname])

    return (
        <FilterProvider>
            <PageCard
                title="Returns"
                subtitle="Efficiently handle all returns"
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
                        className={styles.returnsTabsContainer}
                        color="gray.700"
                        index={tabIndex}
                        onChange={setTabIndex}
                        h={'100%'}
                        borderBottom={0}
                    >
                        <TabList h={'auto'} className={styles.returnTabList}>
                            {tabMenus.map((tabMenu, index) => (
                                <Tab
                                    key={index}
                                    className={styles.returnTab}
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
                            {/* <Tab
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                            >
                                <Link href="/return/requested">
                                    <Text paddingBlock={2} paddingInline={4}>
                                        Requested
                                    </Text>
                                </Link>
                            </Tab>
                            <Tab
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                <Link href="/return/approved">
                                    <Text paddingBlock={2} paddingInline={4}>
                                        Approved
                                    </Text>
                                </Link>
                            </Tab>
                            <Tab
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                <Link href="/return/rejected">
                                    <Text paddingBlock={2} paddingInline={4}>
                                        Rejected
                                    </Text>
                                </Link>
                            </Tab>
                            <Tab
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                <Link href="/return/completed">
                                    <Text paddingBlock={2} paddingInline={4}>
                                        Completed
                                    </Text>
                                </Link>
                            </Tab> */}

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

                        <Box className={styles.returnTabPanel} h={'calc(100% - 5rem)'}>
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
