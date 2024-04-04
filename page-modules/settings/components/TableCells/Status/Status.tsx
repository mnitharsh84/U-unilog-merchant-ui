import { Flex, Switch } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ColumnsData, NewData } from 'page-modules/settings/types/Shared/type'

import style from './status.module.scss'

type Props = {
    info: CellContext<ColumnsData, boolean>
    updateData: (rowIndex: number, newData: NewData) => any
}

const Status = ({ info: { row, getValue }, updateData }: Props) => {
    const status = getValue()
    const handleOnChange = () => {
        const newStatus = !status // Toggle the status
        // setStatus(newStatus); // Update the local state
        const updatedRow = {
            ...row.original,
            status: newStatus, // Update the status property
        }
        let newData: NewData = { status: newStatus }
        if (row.original.groupIndex !== undefined) {
            newData.groupIndex = row.original.groupIndex as number
        }
        updateData(row.index, newData)
    }

    return (
        <Flex align="center" gap={2} className={style.switchContainer}>
            <Switch
                isChecked={status}
                onChange={handleOnChange}
                colorScheme="blue" // Choose the color scheme you prefer
                size="lg" // Adjust the size as needed (sm, md, lg)
            />
        </Flex>
    )
}

export default Status
