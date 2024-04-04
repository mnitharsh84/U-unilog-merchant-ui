import { FetchNdrTerminatedCountsType } from 'apis/get'
import { useEffect, useState } from 'react'

export function useTotalTerminatedBar(data: FetchNdrTerminatedCountsType | undefined) {
    const [barData, setBarData] = useState<{
        labels: string[]
        datasets: {
            label: string
            data: string | number[] | number
            backgroundColor: string
        }[]
    }>({
        labels: [],
        datasets: [],
    })

    useEffect(() => {
        if (!data) return

        setBarData({
            labels: data?.map((el) => el.date_range) || [],
            datasets: [
                {
                    label: 'Total',
                    data: data.map((el) => el['Total NDR shipments']) || [],
                    backgroundColor: 'rgb(255, 99, 132)',
                },
                {
                    label: 'Terminated',
                    data: data.map((el) => el.Terminated) || [],
                    backgroundColor: 'rgb(75, 192, 192)',
                },
            ],
        })
    }, [data])

    return barData
}
