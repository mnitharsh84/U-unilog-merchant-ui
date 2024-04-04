import { Flex } from '@chakra-ui/react'

import PageFilters from '../PageFilters/PageFilters'

type Props = {
    tabIndex: number
}

export default function FilterBar({ tabIndex }: Props) {
    return (
        <Flex>
            {/* Page Filters */}
            <PageFilters />

            {/* Custom Filters */}
        </Flex>
    )
}
