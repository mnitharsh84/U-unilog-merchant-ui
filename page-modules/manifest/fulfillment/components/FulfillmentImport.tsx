import { Box, Center, Select, Text } from '@chakra-ui/react'
import { CreateImportType } from 'apis/import/post'
import ColumnDescription from 'page-modules/imports/components/ColumnDescription'
import ImportUpload from 'page-modules/imports/components/ImportUpload'
import { IMPORT_OPTION } from 'page-modules/imports/utils'
import { useWarehouseList } from 'page-modules/manifest/warehouse/hooks/queries'
import { useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

export default function FulfillmentImport() {
    const { isLoading, isError, data } = useWarehouseList()
    const [warehouse, setWarehouse] = useState<string>('')

    const handleWarehouseSelection = (code: string) => {
        setWarehouse(code)
    }

    if (isLoading)
        return (
            <Center h={`200px`}>
                <Loading />
            </Center>
        )
    if (isError)
        return (
            <Center h={`200px`}>
                <ErrorPlaceholder message="Could not load warehouses. Please try again later." />
            </Center>
        )

    return (
        <Box mb={3}>
            <Text fontSize="10px" color="gray.500" mb={1} ps={3}>
                Warehouse
            </Text>
            <Select
                w={'18.75rem'}
                h={'2rem'}
                size={'md'}
                fontSize={'medium'}
                background={'gray.200'}
                borderRadius={'0.5rem'}
                placeholder="Select warehouse"
                icon={<AiFillCaretDown fontSize={'14px'} />}
                onChange={(ev) => handleWarehouseSelection(ev.target.value)}
                value={warehouse}
                mb={3}
            >
                {data.warehouseList.map((option) => (
                    <option key={option.warehouse_code} value={option.warehouse_code}>
                        {option.name}
                    </option>
                ))}
            </Select>

            {!!warehouse && (
                <Box key={warehouse}>
                    <ColumnDescription
                        importOption={IMPORT_OPTION['Create New / Update Existing']}
                        importType="WAREHOUSE SKU FULFILLABILITY"
                    />
                    <ImportUpload
                        importOption={IMPORT_OPTION['Create New / Update Existing']}
                        importType="WAREHOUSE SKU FULFILLABILITY"
                        handleImportUpload={(response: CreateImportType) => {
                            if (response.success) setWarehouse('')
                        }}
                        additionalInformation={{ warehouse_code: warehouse }}
                    />
                </Box>
            )}
        </Box>
    )
}
