import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Flex,
    Icon,
    Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { CiDeliveryTruck, CiImport, CiLocationArrow1 } from 'react-icons/ci'
import { HiOutlineDocument } from 'react-icons/hi'
import { RxDashboard } from 'react-icons/rx'
import { TbReportAnalytics, TbSettings, TbTruckReturn } from 'react-icons/tb'
import { useAuthProvider } from 'shared/providers/AuthProvider'

import brandLogoUrl from './../../public/brandLogo.png'
import styles from './sidebar.module.scss'
import { SidebarMenu } from './types/Sidebar'

const SIDEBARMENUS: SidebarMenu[] = [
    {
        name: 'Dashboard',
        icon: RxDashboard,
        url: '/dashboard/overview',
        isAllowed: true,
        displayOnSideBar: true,
    },
    {
        name: 'NDR',
        icon: HiOutlineDocument,
        url: '/ndr/actions-required',
        isAllowed: true,
        displayOnSideBar: true,
        accordionIcon: true,
        subMenus: [
            {
                name: 'NDR Management',
                url: '/ndr/actions-required',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Buyer Reattempt Request',
                url: '/buyer/reattempt',
                isAllowed: true,
                displayOnSideBar: true,
            },
        ],
    },
    {
        name: 'Tracking',
        icon: CiLocationArrow1,
        url: '/tracking/orders',
        isAllowed: true,
        displayOnSideBar: true,
        accordionIcon: true,
        subMenus: [
            {
                name: 'Orders',
                url: '/tracking/orders',
                isAllowed: true,
                displayOnSideBar: true,
            },
        ],
    },
    {
        name: 'Return & Exchange',
        url: '/return/requested',
        isAllowed: true,
        icon: TbTruckReturn,
        displayOnSideBar: true,
        accordionIcon: true,
        subMenus: [
            {
                name: 'Returns',
                url: '/return/requested',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Exchanges',
                url: '/exchanges/requested',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Return Setup Policy',
                url: '/return/setup',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Exchange Setup Policy',
                url: '/exchanges/setup',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Reasons',
                url: '/return/reasons',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Manage Teams',
                url: '/teams',
                isAllowed: true,
                displayOnSideBar: true,
            },
        ],
    },
    {
        name: 'Reports',
        url: '/reports',
        isAllowed: true,
        icon: TbReportAnalytics,
        displayOnSideBar: true,
    },
    {
        name: 'Imports',
        url: '/imports',
        isAllowed: true,
        icon: CiImport,
        displayOnSideBar: true,
    },
    {
        name: 'Manifest',
        url: '/manifest/warehouse/view',
        icon: CiDeliveryTruck,
        isAllowed: true,
        displayOnSideBar: true,
        accordionIcon: true,
        subMenus: [
            {
                name: 'Warehouse',
                url: '/manifest/warehouse/view',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Fulfillment',
                url: '/manifest/fulfillment',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'Courier SLA',
                url: '/manifest/courier-sla',
                isAllowed: true,
                displayOnSideBar: true,
            },
            {
                name: 'EDD Calculator',
                url: '/manifest/edd-calculator',
                isAllowed: true,
                displayOnSideBar: true,
            },
        ],
    },
    {
        name: 'Settings',
        url: '/settings',
        isAllowed: true,
        icon: TbSettings,
        displayOnSideBar: true,
    },
]

const setSideBarMenus = (sidebarMennus: SidebarMenu[], allowedURLs: string[] | null) => {
    let allowedSidebarMennus: SidebarMenu[] = []
    if (allowedURLs) {
        if (allowedURLs && allowedURLs.includes('/all_urls')) {
            allowedSidebarMennus = sidebarMennus
        } else {
            sidebarMennus.map((sidebarMenu: SidebarMenu) => {
                if (allowedURLs.includes(sidebarMenu.url)) {
                    if (sidebarMenu.subMenus) {
                        sidebarMenu.subMenus = sidebarMenu.subMenus.filter((subMenu: SidebarMenu) =>
                            allowedURLs.includes(subMenu.url),
                        )
                    }
                    allowedSidebarMennus.push(sidebarMenu)
                }
            })
        }
    }

    return allowedSidebarMennus
}
export default function Sidebar() {
    const { allowedURLs } = useAuthProvider()
    let sidebarMenus: SidebarMenu[] = []
    sidebarMenus = setSideBarMenus(SIDEBARMENUS, allowedURLs)
    return (
        <Flex flexDir="column" className={`${styles.Sidebar} expanded`} px={4} position="absolute" align="flex-start">
            <Flex align="center" gap={2} pt={4} pb={2} minH="55px">
                <Image priority={false} src={brandLogoUrl} alt="Unilog" height="40" />
            </Flex>
            <Accordion allowToggle w={`100%`}>
                {sidebarMenus.map((sidebarMenu, index) =>
                    sidebarMenu.displayOnSideBar ? (
                        <AccordionItem border="0" key={index}>
                            <AccordionButton p={0} className={styles.menuItem} _hover={{ bgColor: 'gray.800' }}>
                                <Link href={sidebarMenu.url} className={styles.menuLink}>
                                    <Flex flexDir="row" flexGrow={1} align="center" gap="0.5rem" py={3} px={2}>
                                        {sidebarMenu.icon && <Icon as={sidebarMenu.icon} fontSize="sm" color="white" />}
                                        <Text
                                            fontWeight="bold"
                                            className={styles.title}
                                            as="span"
                                            fontSize="sm"
                                            color="white"
                                        >
                                            {sidebarMenu.name}
                                        </Text>
                                    </Flex>
                                </Link>
                                {sidebarMenu.accordionIcon && sidebarMenu.subMenus && sidebarMenu.subMenus.length ? (
                                    <Flex px={3} className={styles.menuToggle}>
                                        <AccordionIcon color="white" />
                                    </Flex>
                                ) : null}
                            </AccordionButton>
                            {sidebarMenu.subMenus && sidebarMenu.subMenus.length
                                ? sidebarMenu.subMenus.map((subMenu, index) =>
                                      subMenu.displayOnSideBar ? (
                                          <AccordionPanel
                                              pb="2"
                                              key={`submenu-${index}`}
                                              className={styles.submenuContainer}
                                          >
                                              <Flex flexDir="column" ps={6}>
                                                  <Link href={subMenu.url}>
                                                      <Text
                                                          as="p"
                                                          fontSize="xs"
                                                          color="white"
                                                          className={styles.submenuItem}
                                                      >
                                                          {subMenu.name}
                                                      </Text>
                                                  </Link>
                                              </Flex>
                                          </AccordionPanel>
                                      ) : null,
                                  )
                                : null}
                        </AccordionItem>
                    ) : null,
                )}
            </Accordion>
        </Flex>
    )
}
