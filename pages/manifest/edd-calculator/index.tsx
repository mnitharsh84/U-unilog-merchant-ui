import { CardBody } from '@chakra-ui/react'
import Calculator from 'page-modules/manifest/edd-calculator/components/Calculator'
import EDD from 'page-modules/manifest/edd-calculator/components/EDD'
import { EDD as EddType } from 'page-modules/manifest/edd-calculator/types'
import { useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

export default function EddCalculator() {
    const [eddList, setEddList] = useState<EddType[] | null>(null)

    return (
        <PageCard title={'EDD Calculator'} subtitle={'Simulate response for any destination & SKU'}>
            <CardBody h={'100%'} overflow={'auto'}>
                <Calculator setEddList={setEddList} />
                <EDD eddList={eddList} />
            </CardBody>
        </PageCard>
    )
}
