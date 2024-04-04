import { Box } from '@chakra-ui/react'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'

import { EDD as EddType } from '../types'

export type Props = {
    eddList: EddType[] | null
}
export default function EDD({ eddList }: Props) {
    if (!eddList) return <></>

    const tableColumns = {
        courierCode: 'Courier Code',
        courierName: 'Courier Name',
        warehouse: 'Warehouse',
        mode: 'Delivery mode',
        time: 'Estimated time',
    }

    const tableData: { [key in keyof typeof tableColumns]: { value: string; align: 'left' | 'right' } }[] = eddList.map(
        (row) => ({
            courierCode: {
                value: row.courierCode,
                align: 'left',
            },
            courierName: {
                value: row.courierName,
                align: 'left',
            },
            warehouse: {
                value: row.warehouse,
                align: 'left',
            },
            mode: {
                value: row.mode,
                align: 'left',
            },
            time: {
                value: row.time,
                align: 'left',
            },
        }),
    )

    return (
        <Box>
            <ChakraTable<typeof tableColumns> columns={tableColumns} data={tableData} />
        </Box>
    )
}
