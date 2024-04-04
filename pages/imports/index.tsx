import { CardBody } from '@chakra-ui/react'
import { CreateImportType } from 'apis/import/post'
import ColumnDescription from 'page-modules/imports/components/ColumnDescription'
import ImportUpload from 'page-modules/imports/components/ImportUpload'
import SelectImport from 'page-modules/imports/components/SelectImport'
import SelectImportOption from 'page-modules/imports/components/SelectImportOption'
import { useState } from 'react'
import PageCard from 'shared/components/PageCard/PageCard'

export default function Imports() {
    const [importType, setImportType] = useState<string>('')
    const [importOption, setImportOption] = useState<string>('')

    const handleImportTypeSelection = (value: string) => {
        setImportType(value)
    }

    const handleImportOptionSelection = (value: string) => {
        setImportOption(value)
    }

    const handleImportUpload = (response: CreateImportType) => {
        if (response.success) {
            setImportType('')
            setImportOption('')
        }
    }

    return (
        <PageCard title="Imports" subtitle="Download sample CSVs and import data" cardStyles={{ overflowY: 'auto' }}>
            <CardBody>
                <SelectImport importType={importType} handleImportTypeSelection={handleImportTypeSelection} />
                <SelectImportOption
                    importType={importType}
                    importOption={importOption}
                    handleImportOptionSelection={handleImportOptionSelection}
                />
                <ColumnDescription importType={importType} importOption={importOption} />
                <ImportUpload
                    importType={importType}
                    importOption={importOption}
                    handleImportUpload={handleImportUpload}
                />
            </CardBody>
        </PageCard>
    )
}
