import {
    Box,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftAddon,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import { RxCalendar } from 'react-icons/rx'
import { useDateRange } from 'shared/hooks/useDateRange'

import { useToolbarContext } from './../../ToolbarProvider'

export default function Toolbar() {
    const { onOpen, onClose, isOpen } = useDisclosure()
    const { startDate, endDate, setStartDate, setEndDate } = useToolbarContext()
    const { range, setRange } = useDateRange(onClose, setStartDate, setEndDate)

    const [displayDate, setDisplayDate] = useState('')

    useEffect(() => {
        if (!!startDate && !!endDate) {
            setDisplayDate(`${startDate} to ${endDate}`)
        } else {
            setDisplayDate(``)
        }
    }, [startDate, endDate])

    return (
        <Flex align="center" gap={4}>
            <Box>
                <Popover placement="bottom-end" isLazy isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
                    <PopoverTrigger>
                        <InputGroup cursor="pointer">
                            <InputLeftAddon h={`2rem`}>
                                <Icon as={RxCalendar} fontSize="sm" />
                            </InputLeftAddon>
                            <Input
                                cursor="pointer"
                                readOnly={true}
                                h={`2rem`}
                                p={2}
                                fontSize="xs"
                                w={`180px`}
                                value={displayDate}
                                placeholder="Select a date range"
                            />
                        </InputGroup>
                    </PopoverTrigger>
                    <PopoverContent w={`800px`}>
                        <DateRangePicker
                            onChange={(item) => setRange({ selection: item.selection })}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            ranges={[range.selection]}
                            inputRanges={[]}
                            direction="horizontal"
                        />
                    </PopoverContent>
                </Popover>
            </Box>
        </Flex>
    )
}
