import { Flex, HStack, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { RetrunsColumns } from 'page-modules/return/type/return'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

type Props = {
    info: CellContext<RetrunsColumns, string>
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
