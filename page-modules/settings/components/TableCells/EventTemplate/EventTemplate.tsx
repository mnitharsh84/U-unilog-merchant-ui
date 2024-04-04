import { Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ColumnsData } from 'page-modules/settings/types/Shared/type'

type Props = {
    info: CellContext<ColumnsData, string>
}
const EventTemplate = ({ info: { getValue } }: Props) => <Text>{getValue()}</Text>

export default EventTemplate
