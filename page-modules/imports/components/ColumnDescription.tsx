import { Box, Center, Flex, Link, Text } from '@chakra-ui/react'
import DomainHandler from 'apis/domain-handler'
import { BsFiletypeCsv } from 'react-icons/bs'
import ChakraTable from 'shared/components/ChakraTable/ChakraTable'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'
import { useMetadata } from 'shared/queries'

import { useImportConfig } from '../hooks/queries'

const domainHandler = new DomainHandler()

type Props = {
    importType: string
    importOption: string
}

export default function ColumnDescription({ importType }: Props) {
    const { isLoading, isError, data } = useImportConfig(importType)
    const { data: metadata } = useMetadata()

    if (!importType) return <></>

    if (isLoading)
        return (
            <Center h={`300px`}>
                <Loading />
            </Center>
        )

    if (isError)
        return (
            <Center h={'300px'}>
                <ErrorPlaceholder message="Could not load column data. Please try again later." />
            </Center>
        )

    const tableColumns = {
        name: 'Column Name',
        description: 'Description',
        required: 'Required',
    }

    const tableData: { [key in keyof typeof tableColumns]: { value: string; align: 'left' | 'right' } }[] =
        data.columnList.map((row) => ({
            name: {
                value: row.name,
                align: 'left',
            },
            description: {
                value: row.description,
                align: 'left',
            },
            required: {
                value: row.required ? 'Yes' : '',
                align: 'left',
            },
        }))

    return (
        <Box mb={6}>
            <Flex justifyContent={'space-between'} alignItems={'center'}>
                <Text fontSize="10px" color="gray.500" mb={1} ps={3}>
                    Import Description
                </Text>
                <Link
                    href={`${domainHandler.findDomain(
                        'MERCHANT_PANEL',
                    )}/session/api/v1/imports/jobType-sampleCSV?jobTypeName=${encodeURIComponent(
                        importType,
                    )}&tenantCode=${encodeURIComponent(metadata?.result.tenant_profile.tenant_name ?? '')}`}
                    isExternal
                >
                    <Flex alignItems={'center'}>
                        <BsFiletypeCsv />
                        <Text fontSize="10px" color="gray.500">
                            Download Sample
                        </Text>
                    </Flex>
                </Link>
            </Flex>
            <ChakraTable<typeof tableColumns> columns={tableColumns} data={tableData} />
        </Box>
    )
}
