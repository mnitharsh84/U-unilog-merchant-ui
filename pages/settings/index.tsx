import { ChevronRightIcon } from '@chakra-ui/icons'
import { Card, CardBody, CardHeader, Divider, Flex, Icon, List, ListItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { SettingMenu } from 'page-modules/settings/types/Shared/type'
import React from 'react'
// import { BsCash } from 'react-icons/bs'
// import { FaTruckPickup } from 'react-icons/fa'
// import { GiOrganigram } from 'react-icons/gi'
// import { TbFileInvoice, TbNotification } from 'react-icons/tb'
import { TbNotification, TbTruckReturn, TbUsers } from 'react-icons/tb'
import PageCard from 'shared/components/PageCard/PageCard'
import { useAuthProvider } from 'shared/providers/AuthProvider'

import styles from './settings.module.scss'

const SETTINGMENUS: SettingMenu[] = [
    {
        name: 'Notification',
        icon: TbNotification,
        subMenus: [
            {
                name: 'Communication Channels',
                url: '/settings/communicationChannels',
            },
        ],
    },
    {
        name: 'Return Management',
        icon: TbTruckReturn,
        subMenus: [
            {
                name: 'Setup Policy',
                url: '/return/setup',
            },
            {
                name: 'Reasons',
                url: '/return/reasons',
            },
        ],
    },
    {
        name: 'User Management',
        icon: TbUsers,
        subMenus: [
            {
                name: 'Manage Teams',
                url: '/teams',
            },
        ],
    },
]
const setSettingMenus = (settingMenus: SettingMenu[], allowedURLs: string[] | null) => {
    let allowedSettingMenus: SettingMenu[] = []
    if (allowedURLs) {
        if (allowedURLs && allowedURLs.includes('/all_urls')) {
            allowedSettingMenus = settingMenus
        } else {
            settingMenus.map((settingMenu: SettingMenu) => {
                if (settingMenu.subMenus) {
                    settingMenu.subMenus = settingMenu.subMenus.filter(
                        (subMenu: SettingMenu) => subMenu.url && allowedURLs.includes(subMenu.url),
                    )
                    if (settingMenu.subMenus && settingMenu.subMenus.length) {
                        allowedSettingMenus.push(settingMenu)
                    }
                }
            })
        }
    }

    return allowedSettingMenus
}
export default function SettingsPage() {
    const { allowedURLs } = useAuthProvider()
    let settingMenus: SettingMenu[] = []
    settingMenus = setSettingMenus(SETTINGMENUS, allowedURLs)
    return (
        <PageCard title="Settings" subtitle="Overview your configurations across UniShip. Select a category to begin.">
            <CardBody overflow={`auto`}>
                <Flex gap={4} flexWrap={`wrap`}>
                    {/* <Card className={styles.group_action} w={`24%`}>
                        <CardHeader>
                            <Flex flexDir="row" gap={4} align="center">
                                <Icon as={GiOrganigram} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    Company
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem>
                                    <Flex align="center" justifyContent="space-between" className={styles.link}>
                                        <Link href="/settings/companyProfile" title="Company Profile">
                                            <Text as="span" fontSize="sm">
                                                Company Profile
                                            </Text>
                                        </Link>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem>
                                    <Flex align="center" justifyContent="space-between" mt={2} className={styles.link}>
                                        <Link href="#">
                                            <Text as="span" fontSize="sm">
                                                KYC
                                            </Text>
                                        </Link>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem>
                                    <Flex align="center" justifyContent="space-between" mt={2} className={styles.link}>
                                        <Link href="#">
                                            <Text as="span" fontSize="sm">
                                                KYC International
                                            </Text>
                                        </Link>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem>
                                    <Flex align="center" justifyContent="space-between" mt={2} className={styles.link}>
                                        <Link href="#">
                                            <Text as="span" fontSize="sm">
                                                Change Password
                                            </Text>
                                        </Link>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card>

                    <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4} align="center">
                                <Icon as={FaTruckPickup} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    Pickup Address
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Link href="#">
                                            <Text as="span" fontSize="sm">
                                                Manage Pickup Address
                                            </Text>
                                        </Link>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card>
                    <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4} align="center">
                                <Icon as={BsCash} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    COD Payments
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Text as="span" fontSize="sm">
                                            Bank Details
                                        </Text>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between" mt={2}>
                                        <Text as="span" fontSize="sm">
                                            Early COD
                                        </Text>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between" mt={2}>
                                        <Text as="span" fontSize="sm">
                                            Postpaid
                                        </Text>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card>
                    <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4}>
                                <Icon as={TbFileInvoice} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    Billing
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Text as="span" fontSize="sm">
                                            GSTIN Invoicing
                                        </Text>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between" mt={2}>
                                        <Text as="span" fontSize="sm">
                                            Billing Address
                                        </Text>
                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card> */}
                    {/* <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4}>
                                <Icon as={TbNotification} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    Notification
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Link href="/settings/communicationChannels">
                                            <Text as="span" fontSize="sm">
                                                Communication Channels
                                            </Text>
                                        </Link>

                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card>
                    <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4}>
                                <Icon as={TbTruckReturn} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    Return Management
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Link href="/return/setup">
                                            <Text as="span" fontSize="sm">
                                                Setup(1)
                                            </Text>
                                        </Link>

                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Link href="/return/reasons">
                                                <>
                                                    <Tooltip hasArrow={true} label={` View and update allowed reasons and refund options for returns`}>
                                                        
                                                        <Text as="span" fontSize="sm">
                                                                Reasons
                                                        </Text>

                                                    </Tooltip>
                                                </>

                                        </Link>

                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                            <Link href="/return/requested">
                                                <Text as="span" fontSize="sm">
                                                    Manage Returns
                                                </Text>
                                            </Link>

                                            <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card>

                    <Card className={styles.group_action} w={`24%`} >
                        <CardHeader>
                            <Flex flexDir="row" gap={4}>
                                <Icon as={TbUsers} fontSize="lg" />
                                <Text as="span" fontSize="sm" fontWeight="bold">
                                    User Management
                                </Text>
                            </Flex>
                        </CardHeader>
                        <Divider />
                        <CardBody>
                            <List>
                                <ListItem className={styles.link}>
                                    <Flex align="center" justifyContent="space-between">
                                        <Link href="/users/teams">
                                            <Text as="span" fontSize="sm">
                                                Build Your Team
                                            </Text>
                                        </Link>

                                        <ChevronRightIcon fontSize="sm" />
                                    </Flex>
                                </ListItem>
                            </List>
                        </CardBody>
                    </Card> */}

                    {settingMenus && settingMenus.length ? (
                        settingMenus.map((settingMenu, index) => (
                            <Card key={index} className={styles.group_action} w={`24%`}>
                                <CardHeader>
                                    <Flex flexDir="row" gap={4}>
                                        {settingMenu.icon && <Icon as={settingMenu.icon} fontSize="lg" />}
                                        <Text as="span" fontSize="sm" fontWeight="bold">
                                            {settingMenu.name}
                                        </Text>
                                    </Flex>
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <List>
                                        {settingMenu.subMenus &&
                                            settingMenu.subMenus.map((subMenu, index) => (
                                                <ListItem key={`list-${index}`} className={styles.link}>
                                                    <Flex align="center" justifyContent="space-between">
                                                        {subMenu.url && (
                                                            <Link href={subMenu.url}>
                                                                <Text as="span" fontSize="sm">
                                                                    {subMenu.name}
                                                                </Text>
                                                            </Link>
                                                        )}

                                                        <ChevronRightIcon fontSize="sm" />
                                                    </Flex>
                                                </ListItem>
                                            ))}
                                    </List>
                                </CardBody>
                            </Card>
                        ))
                    ) : (
                        <Card className={styles.group_action} w={`100%`}>
                            <CardBody textAlign="center">No settings found.</CardBody>
                        </Card>
                    )}
                </Flex>
            </CardBody>
        </PageCard>
    )
}
