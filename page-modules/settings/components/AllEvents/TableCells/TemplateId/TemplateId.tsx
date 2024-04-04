import { Box, Button, Flex } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import Chip from 'page-modules/settings/shared/components/Chip/Chip'
import { ColumnsData } from 'page-modules/settings/types/Shared/type'
import { useState } from 'react'

type Props = {
    info: CellContext<ColumnsData, Array<string>>
    maxLength?: number
}
const TemplateId = ({ info: { getValue }, maxLength }: Props) => {
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
                    ? content.map((val, index) => <Chip key={index} label={val} />)
                    : content.slice(0, maxLen).map((val, index) => <Chip key={index} label={val} />)}
            </Flex>
            {content && content.length > maxLen && (
                <Button px={2} pt={2} fontSize="xs" variant="link" color="blue.500" onClick={handleToggleShow}>
                    {showMore ? 'Show Less' : 'Show More'}
                </Button>
            )}
        </Box>
    )
}

export default TemplateId
