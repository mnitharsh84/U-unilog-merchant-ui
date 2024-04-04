import { Tag } from '@chakra-ui/react'

type Params = {
    label: string
}
const Chip = ({ label }: Params) => {
    return (
        <Tag size="sm" backgroundColor="gray.200" color="gray.800" paddingX={2} h={6} paddingY={1}>
            {label}
        </Tag>
    )
}

export default Chip
