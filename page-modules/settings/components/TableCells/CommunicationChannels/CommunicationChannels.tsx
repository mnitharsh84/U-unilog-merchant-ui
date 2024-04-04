import { Select } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ColumnsData } from 'page-modules/settings/types/Shared/type'
import React from 'react'
import { useState } from 'react'

type Props = {
    info: CellContext<ColumnsData, string>
}
const CommunicationChannels = ({ info: { getValue } }: Props) => {
    const [selectedValue, setSelectedValue] = useState(getValue()) // Set the default selected value here
    const allChannels = [
        { value: 'SMS', display: 'SMS' },
        { value: 'WHATSUP', display: 'WHATSUP' },
        { value: 'EMAIL', display: 'EMAIL' },
    ]
    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value) // Update the selected value when an option is chosen
    }
    return (
        <Select value={selectedValue} onChange={handleChange} placeholder="Select an option">
            {Array.isArray(allChannels) &&
                allChannels.map((channel) => <option value={channel.value}>{channel.display}</option>)}
        </Select>
    )
}

export default CommunicationChannels
