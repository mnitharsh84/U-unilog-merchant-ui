import { Box, Button, CardBody, Flex, Tab, TabList, Tabs, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterProvider from 'page-modules/exchange/FilterProvider'
import { toolbarButton } from 'page-modules/exchange/type/exchange'
import React, { ReactNode, useEffect, useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

import styles from '../shared/layout.module.scss'
import { EXCHANGE_VIEW_PAGE_MAP, TAB_NAME_MAP } from './Exchange-route-map'

const toolbar = (toolbarButtons: toolbarButton[] | undefined) => {
    return (
        <Box>
            {toolbarButtons &&
                toolbarButtons.map((button) => (
                    <Button
                        m={2}
                        key={button.actionName}
                        colorScheme={button.colorScheme}
                        onClick={() => button.doAction(button.actionName)}
                        size="xs"
                    >
                        {button.title}
                    </Button>
                ))}
        </Box>
    )
}
export default function ExchangeViewLayout({
    children,
    toolbarButtons,
}: {
    children: ReactNode
    toolbarButtons?: toolbarButton[]
}) {
    const router = useRouter()
    const [tabIndex, setTabIndex] = useState<number>(0)
    const [parentTab, setParentTab] = useState<string | undefined>()

    const { orderId, requestId } = router.query

    useEffect(() => {
        // const tabName: RETURN_VIEW_PATH = router.pathname.split('/').at(-2) as RETURN_VIEW_PATH
        // setTabIndex(RETURN_VIEW_PAGE_MAP[tabName]?.index)
        const parentTab = router.pathname.split('/').at(-2)
        setParentTab(parentTab)
        const tabName = Array.isArray(router.query.viewType)
            ? router.query.viewType[0] // Use the first item if it's an array
            : router.query.viewType || 'view'

        const tabIndex = EXCHANGE_VIEW_PAGE_MAP[tabName]?.index ? EXCHANGE_VIEW_PAGE_MAP[tabName]?.index : 0
        setTabIndex(tabIndex)
    }, [router.pathname])

    return (
        <FilterProvider>
            <PageCard toolbar={toolbar(toolbarButtons)} title={`Order ${orderId}`} cardStyles={{ overflowY: 'auto' }}>
                <CardBody>
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
                            <Tab
                                className={styles.returnExchangeTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                            >
                                <Link
                                    href={`/exchanges/${parentTab}/view/?requestId=${requestId}&orderId=${orderId}&viewType=details`}
                                >
                                    <Text paddingBlock={2} paddingInline={4}>
                                        {`${
                                            parentTab && TAB_NAME_MAP[parentTab]
                                                ? TAB_NAME_MAP[parentTab]['view']
                                                : 'View'
                                        }`}
                                    </Text>
                                </Link>
                            </Tab>
                            <Tab
                                className={styles.returnExchangeTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                <Link
                                    href={`/exchanges/${parentTab}/view?requestId=${requestId}&orderId=${orderId}&&viewType=activity`}
                                >
                                    <Text paddingBlock={2} paddingInline={4}>
                                        Activity
                                    </Text>
                                </Link>
                            </Tab>

                            <Flex
                                ml={'auto'}
                                overflowX={'auto'}
                                overflowY={'hidden'}
                                h={'100%'}
                                alignItems={'center'}
                                gap={1}
                            >
                                {/* <TableActionsMenu /> */}
                            </Flex>
                        </TabList>

                        <Box className={styles.tabPanel}>
                            <Box overflow={'auto'} h={'100%'} zIndex={10}>
                                {children}
                            </Box>
                        </Box>
                    </Tabs>
                </CardBody>
            </PageCard>
        </FilterProvider>
    )
}
