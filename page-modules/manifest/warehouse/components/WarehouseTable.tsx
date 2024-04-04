import { Badge, Button, Center, Flex, Text } from '@chakra-ui/react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import DomainHandler from 'apis/domain-handler'
import TanstackTable from 'lib/TanstackTable/TanstackTable'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

import { useWarehouseList } from '../hooks/queries'
import { WarehouseColumns } from '../types/warehouse'

function createColumns(editWarehouseCallback: (code: string) => void): ColumnDef<WarehouseColumns, any>[] {
    const columnHelper = createColumnHelper<WarehouseColumns>()

    return [
        columnHelper.accessor('name', {
            cell: (info) => <Text>{info.getValue()}</Text>,
            header: 'Name',
            size: 300,
        }),
        columnHelper.accessor('code', {
            cell: (info) => <Text>{info.getValue()}</Text>,
            header: 'Code',
            size: 300,
        }),
        columnHelper.accessor('address', {
            cell: (info) => (
                <>
                    <TextWithTooltip text={info.getValue().addressLine1} width={'100%'}></TextWithTooltip>
                    <TextWithTooltip text={info.getValue().addressLine2} width={'100%'}></TextWithTooltip>
                    <Text>
                        {info.getValue().city}, {info.getValue().stateCode}, {info.getValue().pincode}
                    </Text>
                    <Text>{info.getValue().countryCode}</Text>
                </>
            ),
            header: 'Address',
            size: 300,
        }),
        columnHelper.accessor('enabled', {
            cell: (info) => (
                <Badge colorScheme={info.getValue() ? 'green' : 'red'} fontSize={'10px'}>
                    {info.getValue() ? 'ENABLED' : 'DISABLED'}
                </Badge>
            ),
            header: 'Status',
            size: 300,
        }),
        columnHelper.accessor('omsCode', {
            cell: (info) => <Text>{info.getValue()}</Text>,
            header: 'OMS Code',
            size: 300,
        }),
        columnHelper.accessor('phone', {
            cell: (info) => <Text textAlign={'right'}>{info.getValue()}</Text>,
            header: () => <Text textAlign={'right'}>Phone</Text>,
            size: 300,
        }),
        columnHelper.accessor('email', {
            cell: (info) => <Text>{info.getValue()}</Text>,
            header: 'Email',
            size: 300,
        }),
        columnHelper.accessor('actions', {
            cell: (info) => (
                <Button
                    size="xs"
                    bgColor={'gray.200'}
                    onClick={() => {
                        editWarehouseCallback(info.row.getValue('code'))
                    }}
                    isDisabled={!info.getValue().allowEdit}
                >
                    Edit
                </Button>
            ),
            header: 'Actions',
            size: 300,
        }),
    ]
}

const domainHandler = new DomainHandler()
export default function WarehouseTable() {
    const { isLoading, isError, data } = useWarehouseList()

    const router = useRouter()
    const editWarehouse = useCallback(
        (code: string) => {
            router.push(`/manifest/warehouse/edit?code=${domainHandler.encodeUriParams(code)}`)
        },
        [router],
    )

    const memoizedData: WarehouseColumns[] = useMemo(
        () =>
            data?.warehouseList.map((warehouse) => ({
                name: warehouse.name,
                code: warehouse.warehouse_code,
                address: {
                    addressLine1: warehouse.address_line_1,
                    addressLine2: warehouse.address_line_2,
                    city: warehouse.city,
                    stateCode: warehouse.state_code,
                    countryCode: warehouse.country_code,
                    pincode: warehouse.pincode,
                },
                enabled: warehouse.enabled,
                omsCode: warehouse.oms_code,
                phone: warehouse.phone,
                email: warehouse.email,
                actions: { allowEdit: true },
            })) ?? [],
        [data],
    )

    const memoizedColumns = useMemo(() => createColumns(editWarehouse), [editWarehouse])

    if (isLoading)
        return (
            <Center h={`200px`}>
                <Loading />
            </Center>
        )

    if (isError)
        return (
            <Center h={`200px`}>
                <ErrorPlaceholder />
            </Center>
        )

    return (
        <Flex
            flexDir="column"
            justifyContent="space-between"
            h={`100%`}
            overflow="auto"
            border="1px solid var(--chakra-colors-gray-100)"
        >
            <TanstackTable<WarehouseColumns>
                data={memoizedData}
                columns={memoizedColumns}
                tableStyles={{ minWidth: '100%' }}
                strategy="Basic"
            />
        </Flex>
    )
}
