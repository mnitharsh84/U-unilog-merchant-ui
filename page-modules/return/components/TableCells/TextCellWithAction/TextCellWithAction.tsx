import { HStack, Link } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { RetrunsColumns } from 'page-modules/return/type/return'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'
import { ActionParams } from 'shared/types/table'

type Props = {
    info: CellContext<RetrunsColumns, string>
    doAction: (params: ActionParams) => any
    fxnName: string
}

const TextCellWithAction = ({ info: { getValue, row }, doAction, fxnName }: Props) => {
    const handleClick = () => {
        doAction({ fxnName: fxnName, fxnParams: [{ value: getValue(), saleOrderCode: row.original.sale_order_code }] })
    }
    return (
        // <Flex align="center" gap={2} pl={2}>
        //     <Text>{getValue()}</Text>
        // </Flex>

        <HStack justifyContent="space-between">
            {/* <Text className={styles.key}>Address: </Text> */}
            <Link onClick={handleClick} width={'100%'}>
                <TextWithTooltip text={getValue()} width={'100%'}></TextWithTooltip>
            </Link>
        </HStack>
    )
}

export default TextCellWithAction
