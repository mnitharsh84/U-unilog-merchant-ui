import { Center, Text } from '@chakra-ui/react'
import { ColumnDef, Row, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import Basic from './Basic'
import styles from './TanstackTable.module.scss'
import VirtualRows from './VirtualRows'
import { TableStrategy } from './types'

type Props<K> = {
    data: K[]
    columns: ColumnDef<K>[]
    strategy?: TableStrategy
    headerRowHeight?: number
    dataRowHeight?: number
    getRowCanExpand?: (row: Row<K>) => boolean
    renderSubComponent?: (row: Row<K>) => ReactNode
    tableStyles?: { [key: string]: string }
    tableContainerStyle?: { [key: string]: any }
    headerCellStyles?: { [key: string]: string }
}

export default function TanstackTable<K>({
    data,
    columns,
    getRowCanExpand,
    renderSubComponent,
    headerRowHeight = 2,
    dataRowHeight = 4,
    strategy,
    tableStyles,
    tableContainerStyle,
    headerCellStyles,
}: Props<K>) {
    const memoizedProps = useMemo(() => ({ data, columns }), [data, columns])

    const [refLoaded, setRefLoaded] = useState<boolean>(false)

    const table = useReactTable<K>({
        data: memoizedProps.data,
        columns: memoizedProps.columns,
        getRowCanExpand,
        getCoreRowModel: getCoreRowModel(),
    })

    const tableContainerRef = useRef<HTMLDivElement>(null)
    const { rows } = table.getRowModel()

    useEffect(() => {
        setRefLoaded(true)
    }, [tableContainerRef])

    return (
        <div className={styles.container} ref={tableContainerRef} {...tableContainerStyle}>
            <table className={styles.table} style={tableStyles}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} style={{ height: `${headerRowHeight}rem` }}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    style={{
                                        width: header.getSize(),
                                        verticalAlign: 'top',
                                        ...headerCellStyles,
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {strategy === 'VirtualRows' && refLoaded && (
                        <VirtualRows<K>
                            rows={rows}
                            tableContainerRef={tableContainerRef}
                            dataRowHeight={dataRowHeight}
                            renderSubComponent={renderSubComponent}
                        />
                    )}
                    {strategy === 'Basic' && refLoaded && (
                        <Basic<K> dataRowHeight={dataRowHeight} renderSubComponent={renderSubComponent} rows={rows} />
                    )}
                </tbody>
                <tfoot>
                    {table.getFooterGroups().map((footerGroup) => (
                        <tr key={footerGroup.id}>
                            {footerGroup.headers.map((header) => (
                                <th key={header.id}>
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.footer, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </tfoot>
            </table>
            {table.getRowModel().rows.length === 0 ? (
                <Center className={styles.emptyTable}>
                    <Text textAlign={`center`} fontSize="xs" color="gray.500">
                        No records found.
                    </Text>
                </Center>
            ) : (
                <></>
            )}
        </div>
    )
}
