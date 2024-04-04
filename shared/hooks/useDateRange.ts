import { format } from 'date-fns'
import { startOfMonth } from 'date-fns'
import { useEffect, useState } from 'react'
import { Range } from 'react-date-range'

export function useDateRange(
    onClose: () => void,
    setStartDate: React.Dispatch<React.SetStateAction<string>>,
    setEndDate: React.Dispatch<React.SetStateAction<string>>,
    rangeStartDate?: Date,
    rangeEndDate?: Date,
) {
    const [range, setRange] = useState<{ selection: Range }>({
        selection: {
            startDate: rangeStartDate ?? startOfMonth(new Date()),
            endDate: rangeEndDate ?? new Date(),
            key: 'selection',
        },
    })

    useEffect(() => {
        if (!!range.selection.startDate && !!range.selection.endDate) {
            setStartDate(format(range.selection.startDate, 'yyyy-MM-dd'))
            setEndDate(format(range.selection.endDate, 'yyyy-MM-dd'))
        } else {
            setStartDate('')
            setEndDate('')
        }

        if (
            !!range.selection.startDate &&
            !!range.selection.endDate &&
            range.selection.startDate !== range.selection.endDate
        ) {
            return onClose()
        }
    }, [range.selection])

    return { range, setRange }
}
