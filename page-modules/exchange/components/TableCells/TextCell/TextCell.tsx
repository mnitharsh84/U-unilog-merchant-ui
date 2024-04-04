import { HStack } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ExchangeColumns } from 'page-modules/exchange/type/exchange'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

type Props = {
    info: CellContext<ExchangeColumns, string>
}

const TextCell = ({ info: { getValue } }: Props) => {
    return (
        <HStack justifyContent="space-between">
            {/* <Text className={styles.key}>Address: </Text> */}
            <TextWithTooltip text={getValue()} width={'100%'}></TextWithTooltip>
        </HStack>
    )
}

export default TextCell
