import React, { useContext, useEffect, useState } from 'react'
import { ReactNode } from 'react'
import { useMetadata } from 'shared/queries'

type AuthContextType = {
    allowedURLs: string[] | null
    tenantName: string | null
}
const AuthContext = React.createContext<AuthContextType>({} as AuthContextType)

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [allowedURLs, setAllowedURLs] = useState<string[] | null>(null)
    const [tenantName, setTenantName] = useState<string | null>(null)
    const { data } = useMetadata()

    useEffect(() => {
        if (!data) return

        setAllowedURLs(data.result.allowed_urls)
        // setAllowedURLs(['/all_urls'])
        setTenantName(data.result?.tenant_profile?.tenant_name)
    }, [data])

    return <AuthContext.Provider value={{ allowedURLs, tenantName }}>{children}</AuthContext.Provider>
}

export function useAuthProvider() {
    return useContext(AuthContext)
}
