import { Button, Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { BuyerColumns } from 'page-modules/buyer/types/buyer'
import { ActionParams } from 'shared/types/table'

type Props = {
    info: CellContext<BuyerColumns, string>
    doAction: (params: ActionParams) => any
}

export default function Actions({ info: { row, getValue }, doAction }: Props) {
    return (
        <Flex alignItems={'center'} gap={2}>
            {getValue() === 'OPEN' ? (
                <>
                    <Button
                        size="xs"
                        bgColor={'gray.200'}
                        onClick={() => doAction({ fxnName: 'CLOSE', fxnParams: [row] })}
                    >
                        Approve
                    </Button>
                    <Button
                        size="xs"
                        bgColor={'gray.200'}
                        onClick={() => doAction({ fxnName: 'DISCARD', fxnParams: [row] })}
                    >
                        Discard
                    </Button>
                </>
            ) : (
                <Text pl={2}>{'-'}</Text>
            )}
        </Flex>
    )
}
