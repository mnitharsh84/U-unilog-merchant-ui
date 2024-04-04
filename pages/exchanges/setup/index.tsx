import { CardBody } from '@chakra-ui/react'
import Setup from 'page-modules/exchange/components/setup/Setup'
import PageCard from 'shared/components/PageCard/PageCard'

export default function ExchangeSetup() {
    return (
        <PageCard title={'Exchange Management'} subtitle={`Exchange setup`}>
            <CardBody h={'100%'} overflow={'auto'}>
                <Setup></Setup>
            </CardBody>
        </PageCard>
    )
}
