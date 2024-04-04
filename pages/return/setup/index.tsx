import { CardBody } from '@chakra-ui/react'
import Setup from 'page-modules/return/components/setup/Setup'
import PageCard from 'shared/components/PageCard/PageCard'

export default function ReturnSetup() {
    return (
        <PageCard title={'Return Management'} subtitle={`Return setup`}>
            <CardBody h={'100%'} overflow={'auto'}>
                <Setup></Setup>
            </CardBody>
        </PageCard>
    )
}
