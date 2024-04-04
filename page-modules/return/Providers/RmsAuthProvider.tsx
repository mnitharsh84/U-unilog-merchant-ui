import { ReactNode, createContext, useContext, useState } from 'react'

type Roles = { master_role: Role }
type Role = {
    code: string
    name: string
    type: string
}
export type RmsAuthContextType = {
    roles: Roles
    saveRoles: (role: Role) => void
}
export const RmsAuthContext = createContext<RmsAuthContextType>({} as RmsAuthContextType)

const RmsAuthProvider = ({ children }: { children: ReactNode }) => {
    const [roles, setRoles] = useState<Roles>({
        master_role: {
            code: '',
            name: '',
            type: '',
        },
    })
    const saveRoles = (role: Role) => {
        const newRole: Role = role
        setRoles({ master_role: { ...roles.master_role, ...newRole } })
    }

    return <RmsAuthContext.Provider value={{ roles, saveRoles }}>{children}</RmsAuthContext.Provider>
}

export default RmsAuthProvider

export function useRmsAuthProvider() {
    return useContext(RmsAuthContext)
}
