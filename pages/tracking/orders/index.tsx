import { CardBody } from '@chakra-ui/react'
import FilterBar from 'page-modules/tracking/orders/components/FilterBar'
import Shipments from 'page-modules/tracking/orders/components/Shipments'
import { Filters } from 'page-modules/tracking/orders/types/filters'
import { INIT_FILTER_VALUES } from 'page-modules/tracking/orders/utils'
import { useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

export default function Orders() {
    const [filters, setFilters] = useState<Filters>(INIT_FILTER_VALUES)

    return (
        <PageCard title="Orders" subtitle="View, filter and sort all orders placed with UniShip.">
            <CardBody paddingBottom="0" className={'cardBody'} overflow={`auto`}>
                <FilterBar filters={filters} setFilters={setFilters} />
                <Shipments filters={filters} />
            </CardBody>
        </PageCard>
    )
}
