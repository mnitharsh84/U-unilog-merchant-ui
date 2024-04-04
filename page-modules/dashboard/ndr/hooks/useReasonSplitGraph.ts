import { FetchNdrReasonSplitType } from 'apis/get'
import { useEffect, useState } from 'react'

export function useReasonSplitGraph(data: FetchNdrReasonSplitType | undefined) {
    const [graphData, setGraphData] = useState<{
        labels: string[]
        datasets: {
            label: string
            data: (string | number)[]
            backgroundColor: string[]
        }[]
    }>({
        labels: [],
        datasets: [],
    })

    useEffect(() => {
        if (!data) return

        setGraphData({
            labels: data.pie_chart?.map((reason) => reason.title) || [],
            datasets: [
                {
                    label: 'Count',
                    data: data.pie_chart.map((reason) => reason.value) || [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.75)',
                        'rgba(54, 162, 235, 0.75)',
                        'rgba(255, 206, 86, 0.75)',
                        'rgba(75, 192, 192, 0.75)',
                        'rgba(153, 102, 255, 0.75)',
                        'rgba(285, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(225, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)',
                        'rgba(163, 120, 255, 1)',
                        'rgba(215, 170, 64, 1)',
                        'rgba(153, 120, 255, 1)',
                        'rgba(225, 189, 64, 1)',
                    ],
                },
            ],
        })
    }, [data])

    return graphData
}
