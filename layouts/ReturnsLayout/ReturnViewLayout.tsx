import {
    Box,
    Button,
    CardBody,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Tab,
    TabList,
    Tabs,
    Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import FilterProvider from 'page-modules/return/FilterProvider'
import { toolbarButton } from 'page-modules/return/type/return'
import React, { ReactNode, useEffect, useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import PageCard from 'shared/components/PageCard/PageCard'

import { RETURN_VIEW_PAGE_MAP, TAB_NAME_MAP } from './Return-route-map'
import styles from './ReturnsLayout.module.scss'

const toolbar = (toolbarButtons: toolbarButton[] | undefined) => {
    return (
        <Box>
            {toolbarButtons &&
                toolbarButtons.slice(0, 2).map((button) => (
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
            {toolbarButtons && toolbarButtons.length > 2 ? (
                <Menu autoSelect={false} closeOnSelect={false} placement="bottom-end">
                    <MenuButton fontSize="small">
                        <Flex
                            align="center"
                            justifyContent="space-between"
                            fontWeight="normal"
                            className={styles.filterByButton}
                        >
                            More
                            <AiFillCaretDown fontSize="14px" />
                        </Flex>
                    </MenuButton>
                    <MenuList zIndex={3} maxH={'300px'} overflow={'auto'}>
                        {toolbarButtons.slice(2).map((button) => (
                            <MenuItem onClick={() => button.doAction(button.actionName)} key={button.actionName}>
                                <Text fontSize="xs">{button.title}</Text>
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            ) : null}
        </Box>
    )
}
export default function ReturnsViewLayout({
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
        const parentTab = router.pathname.split('/').at(-1)
        setParentTab(parentTab)
        const tabName = Array.isArray(router.query.viewType)
            ? router.query.viewType[0] // Use the first item if it's an array
            : router.query.viewType || 'view'

        const tabIndex = RETURN_VIEW_PAGE_MAP[tabName]?.index ? RETURN_VIEW_PAGE_MAP[tabName]?.index : 0
        setTabIndex(tabIndex)
    }, [router.pathname])

    return (
        <FilterProvider>
            <PageCard toolbar={toolbar(toolbarButtons)} title={`Order ${orderId}`} cardStyles={{ overflowY: 'auto' }}>
                <CardBody>
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
                            <Tab
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                            >
                                <Link href={`/return/${parentTab}/${orderId}?requestId=${requestId}&viewType=details`}>
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
                                className={styles.returnTab}
                                fontSize="sm"
                                _selected={{ color: 'blue.400', borderColor: 'blue.400' }}
                                fontWeight="bold"
                                paddingInline={4}
                            >
                                <Link href={`/return/${parentTab}/${orderId}?requestId=${requestId}&viewType=activity`}>
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

                        <Box className={styles.returnTabPanel}>
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
