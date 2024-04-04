import { Button, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { Action, ActionParams, ColumnsData, actionNewData } from 'page-modules/settings/types/Shared/type'
import { GoKebabVertical } from 'react-icons/go'

type Props = {
    info: CellContext<ColumnsData, Action>
    doAction: (params: ActionParams) => any
}

const Actions = ({ info: { row, getValue }, doAction }: Props) => {
    const handleClick = (fxnName: string) => {
        let newData: actionNewData = { rowIndex: row.index }
        if (row.original.groupIndex !== undefined) {
            newData.groupIndex = row.original.groupIndex as number
        }
        doAction({ fxnName: fxnName, fxnParams: [newData] })
    }

    const content = getValue()

    return (
        <Flex alignItems={'center'} gap={2}>
            {content.outside.map((action) => (
                <Button
                    key={action.actionName}
                    size="xs"
                    bgColor={'gray.200'}
                    onClick={() => handleClick(action.actionName)}
                >
                    {action.label}
                </Button>
            ))}
            {Array.isArray(content.inside) && content.inside.length > 0 ? (
                <Menu autoSelect={false}>
                    <MenuButton
                        key={'action-menu-button'}
                        as={IconButton}
                        aria-label="Options"
                        icon={<GoKebabVertical />}
                        // borderRadius={'50%'}
                        minW={'2rem'}
                        h={'2rem'}
                        variant="ghost"
                        _hover={{ backgroundColor: 'var(--chakra-colors-gray-200)' }}
                    />
                    <MenuList>
                        {content.inside.map((action, index) => (
                            <MenuItem
                                key={`${action.actionName}${index}`}
                                onClick={() => handleClick(action.actionName)}
                            >
                                {action.label}
                            </MenuItem>
                        ))}
                    </MenuList>
                </Menu>
            ) : null}
        </Flex>
    )
}

export default Actions
