import { Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ReportsColumns } from 'page-modules/ndr/types/reports'

type Props = {
    info: CellContext<ReportsColumns, string>
}

export default function LastActionBy({ info: { getValue } }: Props) {
    return (
        <>
            <Text>{getValue()}</Text>
        </>
    )
}
