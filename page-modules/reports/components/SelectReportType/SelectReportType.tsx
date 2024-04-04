import { Select, Text } from '@chakra-ui/react'
import { selectOption } from 'page-modules/reports/type/reports'
import { ChangeEvent } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'

type Props = {
    title: string
    data: selectOption[]
    handleSelectReport: (event: ChangeEvent<HTMLSelectElement>) => void
    selectWidth?: string
    selectSize?: string
    selectFontSize?: string
    selectBackground?: string
    selectBorderRadius?: string
    selectHeight?: string
}

export default function SelectReportType({
    title,
    data,
    handleSelectReport,
    selectWidth = '250px',
    selectSize = 'sm',
    selectFontSize = 'small',
    selectBackground = 'white',
    selectBorderRadius = '0.3rem',
    selectHeight = '32px',
}: Props) {
    return (
        <>
            <Text fontSize="10px" color="gray.500" mb={1} ps={3}>
                {title}
            </Text>
            <Select
                w={selectWidth}
                h={selectHeight}
                size={selectSize}
                fontSize={selectFontSize}
                background={selectBackground}
                borderRadius={selectBorderRadius}
                placeholder="Select report"
                icon={<AiFillCaretDown fontSize={'14px'} />}
                onChange={(ev) => handleSelectReport(ev)}
            >
                {data?.map((option, optionIdx) => (
                    <option key={optionIdx} value={option.name}>
                        {option.display_name}
                    </option>
                ))}
            </Select>
        </>
    )
}
