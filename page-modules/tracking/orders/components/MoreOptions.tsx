import { DownloadIcon } from '@chakra-ui/icons'
import { IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Tooltip } from '@chakra-ui/react'
import * as PapaParse from 'papaparse'
import { useState } from 'react'
import { HiEllipsisVertical } from 'react-icons/hi2'

import { useShipments } from '../hooks/queries'
import { Filters } from '../types/filters'

type Props = {
    filters: Filters
}

export default function MenuOptions({ filters }: Props) {
    const [tooltipOpen, setTooltipOpen] = useState(false)
    const { data } = useShipments(filters)

    function handleCSVDownload() {
        const tableData = data?.result?.tracking_records ?? []

        const csv = PapaParse.unparse(tableData)
        const blob = new Blob([csv], { type: 'text/csv' })
        const a = document.createElement('a')
        a.download = `Tracking_${new Date().toLocaleDateString('en-IN').split('/').join('')}`
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    return (
        <Menu autoSelect={false} arrowPadding={8} isLazy={true}>
            <Tooltip hasArrow label="Actions" isOpen={tooltipOpen} defaultIsOpen={false} closeOnPointerDown={true}>
                <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HiEllipsisVertical />}
                    size="sm"
                    fontSize="lg"
                    onClick={() => setTooltipOpen(false)}
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                />
            </Tooltip>
            <MenuList zIndex={3}>
                <MenuItem icon={<DownloadIcon />} onClick={handleCSVDownload}>
                    <Text>Download as CSV</Text>
                </MenuItem>
            </MenuList>
        </Menu>
    )
}
