import React, { ReactNode, createContext, useContext, useState } from 'react'

type ToolbarProps = {
    startDate: string
    endDate: string
    setStartDate: React.Dispatch<React.SetStateAction<string>>
    setEndDate: React.Dispatch<React.SetStateAction<string>>
}
const ToolbarContext = createContext<ToolbarProps>({} as ToolbarProps)

export default function ToolbarProvider({ children }: { children: ReactNode }) {
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')

    return (
        <ToolbarContext.Provider
            value={{
                startDate,
                endDate,
                setStartDate,
                setEndDate,
            }}
        >
            {children}
        </ToolbarContext.Provider>
    )
}

export function useToolbarContext() {
    return useContext(ToolbarContext)
}
