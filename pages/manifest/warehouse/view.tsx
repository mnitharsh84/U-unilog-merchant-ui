import { Box, CardBody, IconButton, Tooltip } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import WarehouseTable from 'page-modules/manifest/warehouse/components/WarehouseTable'
import { GoPlus } from 'react-icons/go'
import PageCard from 'shared/components/PageCard/PageCard'

function Toolbar() {
    const router = useRouter()

    return (
        <Box ml={4} pt={1} paddingBottom={4} overflowX={'auto'} overflowY={'hidden'} h={'100%'}>
            <Tooltip hasArrow label="Add Warehouse">
                <IconButton
                    aria-label="Add Warehouse"
                    ms={2}
                    icon={
                        <>
                            <GoPlus />
                        </>
                    }
                    size="sm"
                    onClick={() => router.push('/manifest/warehouse/add')}
                ></IconButton>
            </Tooltip>
        </Box>
    )
}

export default function Warehouse() {
    return (
        <PageCard title="Warehouses" subtitle="List of all configured warehouses" toolbar={<Toolbar />}>
            <CardBody h={'100%'} overflow={'auto'}>
                <WarehouseTable />
            </CardBody>
        </PageCard>
    )
}
