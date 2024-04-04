import { IconType } from 'react-icons'

export type SidebarMenu = {
    name: string
    icon?: IconType
    url: string
    isAllowed: boolean
    subMenus?: Array<SidebarMenu>
    displayOnSideBar: boolean
    accordionIcon?: boolean
}
