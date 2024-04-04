import { Box, CardBody } from '@chakra-ui/react'
import ColumnDescription from 'page-modules/imports/components/ColumnDescription'
import ImportUpload from 'page-modules/imports/components/ImportUpload'
import { IMPORT_OPTION } from 'page-modules/imports/utils'
import PageCard from 'shared/components/PageCard/PageCard'

export default function CourierSLA() {
    return (
        <PageCard title={'Courier SLA'} subtitle={'Import courier SLA data'}>
            <CardBody h={'100%'} overflow={'auto'}>
                <Box>
                    <ColumnDescription
                        importOption={IMPORT_OPTION['Create New / Update Existing']}
                        importType="Courier SLA"
                    />
                    <ImportUpload
                        importOption={IMPORT_OPTION['Create New / Update Existing']}
                        importType="Courier SLA"
                        handleImportUpload={() => void 0}
                    />
                </Box>
            </CardBody>
        </PageCard>
    )
}
