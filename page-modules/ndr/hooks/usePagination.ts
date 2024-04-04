import { PaginationState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export default function usePagination() {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const [pageCount, setPageCount] = useState<number>(1)

    const [items, setItems] = useState<number>(1)

    useEffect(() => {
        setPageCount(Math.ceil(items / pageSize))
        setPagination((prev) => ({ ...prev, pageIndex: 0 }))
    }, [items, pageSize])

    return { pageIndex, pageSize, pageCount, setItems, setPagination }
}
