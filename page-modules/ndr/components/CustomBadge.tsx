import { Badge } from '@chakra-ui/react'
import { ReactNode } from 'react'

export default function CustomBadge({ children }: { children: ReactNode }) {
    return (
        <Badge bgColor="blue.50" color="blue.400" marginInline={1} fontWeight="normal">
            {children}
        </Badge>
    )
}
