import { Divider, Flex, Text } from '@chakra-ui/react'

import { useFilterContext } from '../FilterProvider'
import { useFilters } from '../hooks/queries'
import CustomBadge from './CustomBadge'
import CustomTag from './CustomTag'

export default function FilterStatus() {
    const { pageFilters, customFilters } = useFilterContext()
    const { data, isLoading, isError } = useFilters()

    if (isLoading || isError) return <></>

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

            {/* REASONS */}
            {Boolean(pageFilters.ndrReasons.length) && (
                <CustomTag title={'NDR Reasons'}>
                    {pageFilters.ndrReasons.map((reason, index) => (
                        <CustomBadge key={index}>
                            {data.find((obj) => obj.key === 'ndr_status')?.option.find((opt) => opt.key === reason)
                                ?.display || reason}
                        </CustomBadge>
                    ))}
                </CustomTag>
            )}

            {/* SHIPPING PROVIDERS */}
            {Boolean(pageFilters.shippingProviders.length) && (
                <CustomTag title={'Shipping Provider'}>
                    {pageFilters.shippingProviders.map((provider, index) => (
                        <CustomBadge key={index}>
                            {data
                                .find((obj) => obj.key === 'shipping_providers')
                                ?.option.find((opt) => opt.key === provider)?.display || provider}
                        </CustomBadge>
                    ))}
                </CustomTag>
            )}

            {/* CUSTOM FILTERS */}
            {Object.keys(customFilters).map((key) => {
                if (Array.isArray(customFilters[key].value)) {
                    if (!customFilters[key].value.length) return <></>

                    return (
                        <CustomTag title={data.find((obj) => obj.key === key)?.display || key} key={key}>
                            {(customFilters[key].value as []).map((value, index) => (
                                <CustomBadge key={index}>
                                    {data.find((obj) => obj.key === key)?.option.find((opt) => opt.key === value)
                                        ?.display || value}
                                </CustomBadge>
                            ))}
                        </CustomTag>
                    )
                } else
                    return (
                        <CustomTag title={data.find((obj) => obj.key === key)?.display || key} key={key}>
                            <CustomBadge>{customFilters[key].value}</CustomBadge>
                        </CustomTag>
                    )
            })}
        </Flex>
    )
}
