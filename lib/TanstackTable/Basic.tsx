import { Row, flexRender } from '@tanstack/react-table'
import { Fragment, ReactNode } from 'react'

type Props<K> = {
    rows: Row<K>[]
    renderSubComponent: ((row: Row<K>) => ReactNode) | undefined
    dataRowHeight: number
}

export default function Basic<K>({ rows, renderSubComponent, dataRowHeight }: Props<K>) {
    return (
        <>
            {rows.map((row) => {
                return (
                    <Fragment key={row.id}>
                        <tr style={{ height: `${dataRowHeight}rem` }}>
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
                                <td colSpan={row.getVisibleCells().length}>{renderSubComponent?.(row)}</td>
                            </tr>
                        ) : (
                            <></>
                        )}
                    </Fragment>
                )
            })}
        </>
    )
}
