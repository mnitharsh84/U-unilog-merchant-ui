import {
    Box,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputLeftAddon,
    InputRightAddon,
    Popover,
    PopoverContent,
    PopoverTrigger,
    useDisclosure,
    useOutsideClick,
} from '@chakra-ui/react'
import { startOfDay } from 'date-fns'
import { format } from 'date-fns'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import React, { MouseEvent, useRef, useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { RiCloseFill } from 'react-icons/ri'
import { RxCalendar } from 'react-icons/rx'
import { Field } from 'shared/types/forms'

import styles from './DateRange.module.scss'

type Props = {
    fieldKey: string
    field: Field<'daterange'>
}
export default function DateRange({ fieldKey, field }: Props) {
    const formik = useFormikContext()
    // const [customField, meta] = useField(fieldKey);
    const { onOpen, onClose, isOpen } = useDisclosure()
    const [isCloseClicked, setIsCloseClicked] = useState<boolean>(false)
    let startDate = new Date()
    let endDate = new Date()
    let intialDisplayDate = ''
    if (field.init_value && !isCloseClicked) {
        if (field.init_value.startDate && field.init_value.startDate instanceof Date) {
            startDate = field.init_value.startDate
        }
        if (field.init_value.endDate && field.init_value.endDate instanceof Date) {
            endDate = field.init_value.endDate
        }
        if (field.init_value.startDate && field.init_value.endDate) {
            intialDisplayDate = `${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')}`
        }
    }

    const [selectedRange, setSelectedRange] = useState([
        {
            startDate: startOfDay(startDate),
            endDate: startOfDay(endDate),
            key: 'selection',
        },
    ])
    const handleSelect = (ranges: any) => {
        setSelectedRange([ranges.selection])
        formik.setFieldValue(fieldKey, {
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        })
        setDisplayDate(
            `${format(ranges.selection.startDate, 'yyyy-MM-dd')} to ${format(ranges.selection.endDate, 'yyyy-MM-dd')}`,
        )
        if (
            !!ranges.selection.startDate &&
            !!ranges.selection.endDate &&
            ranges.selection.startDate !== ranges.selection.endDate
        ) {
            return onClose()
        }
    }
    const [displayDate, setDisplayDate] = useState(intialDisplayDate)

    const initialFocusRef = useRef(null)

    // Access the error for the nested field
    const nestedError = getIn(formik.errors, fieldKey)
    // Access the touched status for the nested field
    const nestedTouched = getIn(formik.touched, fieldKey)
    // Check if the field is touched to determine if it's invalid
    const isInvalid = nestedTouched && nestedError
    const popoverRef = useRef(null)

    // Close the popover when clicking outside
    useOutsideClick({
        ref: popoverRef,
        handler: () => {
            onClose()
        },
    })
    // Manually merge formik.getFieldProps(fieldKey) and displayDate
    const inputProps = {
        ...formik.getFieldProps(fieldKey),
        value: displayDate ? displayDate : intialDisplayDate,
    }
    const removeSelectedValue = (event: MouseEvent) => {
        event.preventDefault()
        setSelectedRange([
            {
                startDate: startOfDay(startDate),
                endDate: startOfDay(endDate),
                key: 'selection',
            },
        ])
        formik.setFieldValue(fieldKey, {
            startDate: null,
            endDate: null,
        })
        setDisplayDate('')
        setIsCloseClicked(true)
    }

    return (
        <Flex align="center" gap={4} w={'100%'}>
            <Box w={'100%'}>
                <Popover
                    placement="bottom-end"
                    isLazy
                    isOpen={isOpen}
                    onOpen={onOpen}
                    onClose={onClose}
                    initialFocusRef={initialFocusRef}
                >
                    <PopoverTrigger>
                        <InputGroup cursor="pointer" className={`${isInvalid ? styles.daterangeInvalid : ''}`}>
                            <InputLeftAddon h={`2rem`} className={`${isInvalid ? styles.noBorder : ''}`}>
                                <Icon as={RxCalendar} fontSize="sm" />
                            </InputLeftAddon>
                            <Input
                                ref={initialFocusRef}
                                cursor="pointer"
                                readOnly={true}
                                h={`2rem`}
                                p={2}
                                fontSize="xs"
                                {...inputProps}
                                placeholder="Select a date range"
                                className={`${isInvalid ? styles.noBorder : ''} ${!field.editable ? 'mandatory' : ''}`}
                            />
                            <InputRightAddon
                                bg={'white'}
                                onClick={(event) => removeSelectedValue(event)}
                                p="0"
                                h={`2rem`}
                                className={`${isInvalid ? styles.noBorder : ''}`}
                            >
                                <Icon as={RiCloseFill} fontSize="sm" />
                            </InputRightAddon>
                        </InputGroup>
                    </PopoverTrigger>
                    <PopoverContent w={`800px`} ref={popoverRef}>
                        <DateRangePicker
                            ranges={selectedRange}
                            onChange={handleSelect}
                            moveRangeOnFirstSelection={false}
                            months={2}
                            inputRanges={[]}
                            direction="horizontal"
                        />
                    </PopoverContent>
                </Popover>
            </Box>
        </Flex>
    )
}
