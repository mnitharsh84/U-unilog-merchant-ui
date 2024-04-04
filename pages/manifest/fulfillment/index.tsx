import { CardBody } from '@chakra-ui/react'
import FulfillmentImport from 'page-modules/manifest/fulfillment/components/FulfillmentImport'
import PageCard from 'shared/components/PageCard/PageCard'

export default function Fulfillment() {
    return (
        <PageCard title={'Fulfillment'} subtitle={'Import warehouse fulfillment data'}>
            <CardBody h={'100%'} overflow={'auto'}>
                <FulfillmentImport />
            </CardBody>
        </PageCard>
    )
}
