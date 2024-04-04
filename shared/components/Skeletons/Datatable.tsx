import { Box, Flex, Skeleton } from '@chakra-ui/react'

type Props = {
    rows: number
    columns: number
}

export default function DatatableSkeleton({ rows, columns }: Props) {
    return (
        <Box>
            <Skeleton w={'100%'} h={'30px'} mb={'1rem'}></Skeleton>
            <Flex flexDir={'column'} gap={'3rem'}>
                {Array.from({ length: rows }).map((_, index) => {
                    return (
                        <Flex gap={'5rem'} justifyContent={'space-between'} key={index}>
                            {Array.from({ length: columns }).map((_, index) => {
                                return <Skeleton key={index} h={'30px'} w={'90px'} />
                            })}
                        </Flex>
                    )
                })}
            </Flex>
        </Box>
    )
}
