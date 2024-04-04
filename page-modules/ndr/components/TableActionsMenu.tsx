import { HamburgerIcon } from '@chakra-ui/icons'
import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { BsFiletypeCsv } from 'react-icons/bs'

export default function TableActionsMenu() {
    return (
        <Menu size={'sm'}>
            <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon fontSize={'sm'} />}
                variant="ghost"
                minW={'2rem'}
                h={'2rem'}
            />
            <MenuList zIndex={3}>
                <MenuItem icon={<BsFiletypeCsv />}>Export</MenuItem>
            </MenuList>
        </Menu>
    )
}
