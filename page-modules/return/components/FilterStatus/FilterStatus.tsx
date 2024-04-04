import { Divider, Flex, Text } from '@chakra-ui/react'
import { useFilterContext } from 'page-modules/return/FilterProvider'
import CustomBadge from 'shared/components/CustomBadge/CustomBadge'
import CustomTag from 'shared/components/CustomTag/CustomTag'

export default function FilterStatus() {
    const { pageFilters } = useFilterContext()
    return (
        <Flex backgroundColor={'white'} gap={2} fontSize="sm" height="2rem" overflowX="auto" align="center">
            <Text fontSize="sm">Filters Applied: </Text>
            {/* DATE RANGE */}
            <CustomTag title={'DATE'}>
                <Divider orientation="vertical" borderColor="red" />
                <CustomBadge>{pageFilters.startDate}</CustomBadge>
                <Text> to </Text>
                <CustomBadge>{pageFilters.endDate}</CustomBadge>
            </CustomTag>

            {/* SEARCH BOX */}
            {Boolean(pageFilters.searchText) && (
                <CustomTag title={'QUERY'}>
                    <CustomBadge>
                        <Text></Text>
                        {pageFilters.searchText}
                    </CustomBadge>
                </CustomTag>
            )}
        </Flex>
    )
}
