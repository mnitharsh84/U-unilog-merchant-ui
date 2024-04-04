import { Row, flexRender } from '@tanstack/react-table'
import { useVirtual } from '@tanstack/react-virtual'
import { Fragment, ReactNode, RefObject } from 'react'

type Props<K> = {
    rows: Row<K>[]
    tableContainerRef: RefObject<HTMLDivElement>
    renderSubComponent: ((row: Row<K>) => ReactNode) | undefined
    dataRowHeight: number
}

export default function VirtualRows<K>({ rows, tableContainerRef, renderSubComponent, dataRowHeight }: Props<K>) {
    const rowVirtualizer = useVirtual({
        parentRef: tableContainerRef,
        size: rows.length,
        overscan: 10,
    })

    const { virtualItems: virtualRows, totalSize } = rowVirtualizer
    const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
    const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0
    return (
        <>
            {paddingTop > 0 && (
                <tr>
                    <td style={{ height: `${paddingTop}px` }} />
                </tr>
            )}
            {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index]
                return (
                    <Fragment key={row.id}>
                        <tr style={{ height: `${dataRowHeight}rem`, backgroundColor: `white` }}>
                            {row.getVisibleCells().map((cell) => {
                                return (
                                    <td
                                        key={cell.id}
                                        style={{
                                            width: cell.column.getSize(),
                                        }}
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                )
                            })}
                        </tr>
                        {row.getIsExpanded() ? (
                            <tr>
                                <td
                                    colSpan={row.getVisibleCells().length}
                                    style={{ paddingTop: `0`, boxShadow: `0 0 4px inset rgba(0,0,0,0.1)` }}
                                >
                                    {renderSubComponent?.(row)}
                                </td>
                            </tr>
                        ) : (
                            <></>
                        )}
                    </Fragment>
                )
            })}
            {paddingBottom > 0 && (
                <tr>
                    <td style={{ height: `${paddingBottom}px` }} />
                </tr>
            )}
        </>
    )
}
