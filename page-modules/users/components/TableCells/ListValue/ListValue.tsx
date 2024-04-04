import { Box, Button, Flex } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { useState } from 'react'
import Chip from 'shared/components/Chip/Chip'
import { ColumnsData } from 'shared/types/table'

type Props = {
    info: CellContext<ColumnsData, Array<any>>
    maxLength?: number
}
const ListValue = ({ info: { getValue }, maxLength }: Props) => {
    const [showMore, setShowMore] = useState(false)
    const content = Array.isArray(getValue()) ? getValue() : []
    const maxLen = maxLength ? maxLength : 2
    const handleToggleShow = () => {
        setShowMore((prevState) => !prevState)
    }
    return (
        <Box>
            <Flex gap={2} direction="row" align="center" wrap="wrap">
                {showMore
                    ? content.map((val, index) => <Chip key={index} label={val.name} />)
                    : content.slice(0, maxLen).map((val, index) => <Chip key={index} label={val.name} />)}
            </Flex>
            {content && content.length > maxLen && (
                <Button px={2} pt={2} fontSize="xs" variant="link" color="blue.500" onClick={handleToggleShow}>
                    {showMore ? 'Show Less' : 'Show More'}
                </Button>
            )}
        </Box>
    )
}

export default ListValue
