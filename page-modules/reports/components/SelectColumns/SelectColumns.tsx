import { Box, Checkbox, Flex, Text } from '@chakra-ui/react'
import React from 'react'

type ColumnType = {
    name: string
    display_name: string
}

type Props = {
    selectAll: boolean
    availableColumns: Array<ColumnType>
    selectedColumns: Array<ColumnType>
    updateSelectedColumns: (newSelectedColumns: ColumnType[]) => void
    updateSelectAll: (newSelectAll: boolean) => void
    title: string
    isShowSelectAll: boolean
    titleStyle: { [key: string]: string }
}

export default function SelectColumns({
    selectAll,
    availableColumns,
    selectedColumns,
    updateSelectedColumns,
    updateSelectAll,
    title,
    isShowSelectAll,
    titleStyle,
}: Props) {
    const handleSelectAll = () => {
        if (selectAll) {
            updateSelectedColumns([])
        } else {
            updateSelectedColumns([...availableColumns])
        }
        updateSelectAll(!selectAll)
    }

    const handleCheckboxChange = (column: ColumnType) => {
        if (selectedColumns.some((item: ColumnType) => item.name === column.name)) {
            updateSelectedColumns(selectedColumns.filter((item: ColumnType) => item.name !== column.name))
            updateSelectAll(selectedColumns.length - 1 === availableColumns.length) // Check if all checkboxes are selected
        } else {
            updateSelectedColumns([...selectedColumns, column])
            updateSelectAll(selectedColumns.length + 1 === availableColumns.length) // Check if all checkboxes are selected
        }
    }

    const { fontSize = 'xs', color = 'gray.600', mb = 1, ps = 3, ...otherStyle } = titleStyle ? titleStyle : {}

    return (
        <>
            <Text fontSize={fontSize} color={color} mb={mb} ps={ps} {...otherStyle}>
                {title}
            </Text>
            <Flex flexWrap="wrap" mt={4}>
                {isShowSelectAll ? (
                    <Box mb={4} w="100%">
                        <Checkbox isChecked={selectAll} onChange={handleSelectAll} flex="0 0 auto">
                            Select All
                        </Checkbox>
                    </Box>
                ) : null}

                {availableColumns.map((column: ColumnType, index) => (
                    <Box key={index} mb={2} w="200px">
                        <Checkbox
                            key={column.name}
                            value={column.name}
                            isChecked={selectedColumns.some((item: ColumnType) => item.name === column.name)}
                            onChange={() => handleCheckboxChange(column)}
                        >
                            {column.display_name}
                        </Checkbox>
                    </Box>
                ))}
            </Flex>
        </>
    )
}
