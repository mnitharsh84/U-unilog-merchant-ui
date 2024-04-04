import { CheckCircleIcon } from '@chakra-ui/icons'
import {
    Box,
    Center,
    CircularProgress,
    Flex,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    Tooltip,
} from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { CiImport } from 'react-icons/ci'
import { RxCrossCircled } from 'react-icons/rx'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import styles from './navbar.module.scss'
import { useImportProgress } from './queries'

export default function Imports() {
    const { data, isLoading, isError, refetch } = useImportProgress()

    return (
        <Popover placement="bottom-end" closeOnEsc={true} isLazy>
            <PopoverTrigger>
                <Box onClick={() => refetch()}>
                    <Tooltip label="Imports" hasArrow>
                        <IconButton
                            aria-label="import"
                            icon={<CiImport fontSize={'large'} />}
                            size="sm"
                            variant="ghost"
                        ></IconButton>
                    </Tooltip>
                </Box>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverArrow />
                    <Flex justify={`space-between`} w={`100%`} alignItems="center">
                        <Text fontWeight={'bold'} fontSize="sm">
                            Imports
                        </Text>
                        <PopoverCloseButton />
                    </Flex>
                </PopoverHeader>
                <PopoverBody p={0} maxH={`200px`} overflow="auto">
                    {isLoading && (
                        <Center h={'100px'}>
                            <Loading />
                        </Center>
                    )}
                    {isError && (
                        <Center h={'100px'}>
                            <ErrorPlaceholder />
                        </Center>
                    )}
                    {data &&
                        data?.map((file, index) => (
                            <Flex mt={1} justify={`space-between`} align="center" fontSize={'xs'} key={index}>
                                {file.status === 'FAILED' && (
                                    <Link href={file.file_url ?? '#'} target="_blank" className={styles.exportLink}>
                                        <Flex
                                            borderBottom="1px solid var(--chakra-colors-gray-200)"
                                            w={`100%`}
                                            px={4}
                                            py={2}
                                            justify={`space-between`}
                                            align="center"
                                        >
                                            <Flex flexDir="column">
                                                <Text fontSize="sm">{file.display_name}</Text>
                                                <Text fontSize="xs" color="gray.500">
                                                    Processed:{' '}
                                                    <Tooltip hasArrow={true} label={file.timestamp}>
                                                        {formatDistanceToNow(
                                                            file.timestamp ? new Date(file.timestamp) : new Date(),
                                                            {
                                                                addSuffix: true,
                                                            },
                                                        )}
                                                    </Tooltip>
                                                </Text>
                                            </Flex>

                                            <Flex justify={`flex-end`}>
                                                {file.status === 'FAILED' && (
                                                    <Tooltip label="Download" hasArrow={true}>
                                                        <span>
                                                            <RxCrossCircled fontSize={'1rem'} color={'red'} />
                                                        </span>
                                                    </Tooltip>
                                                )}
                                            </Flex>
                                        </Flex>
                                    </Link>
                                )}

                                {(file.status === 'SCHEDULED' ||
                                    file.status === 'RUNNING' ||
                                    file.status === 'COMPLETE') && (
                                    <Flex
                                        borderBottom="1px solid var(--chakra-colors-gray-200)"
                                        w={`100%`}
                                        px={4}
                                        py={2}
                                        justify={`space-between`}
                                        align="center"
                                    >
                                        <Flex flexDir="column">
                                            <Text fontSize="sm">{file.display_name}</Text>
                                            <Text fontSize="xs" color="gray.500">
                                                Processed:{' '}
                                                <Tooltip hasArrow={true} label={file.timestamp}>
                                                    {formatDistanceToNow(
                                                        file.timestamp ? new Date(file.timestamp) : new Date(),
                                                        {
                                                            addSuffix: true,
                                                        },
                                                    )}
                                                </Tooltip>
                                            </Text>
                                        </Flex>

                                        <Flex justify={`flex-end`}>
                                            {file.status !== 'COMPLETE' && (
                                                <CircularProgress
                                                    className={styles.circularProgress}
                                                    isIndeterminate
                                                    color="#63b3ed"
                                                />
                                            )}

                                            {file.status === 'COMPLETE' && (
                                                <CheckCircleIcon fontSize={'1rem'} color={'green.400'} />
                                            )}
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>
                        ))}
                    {!isError && data && !data.length && (
                        <Center h={`100px`}>
                            <Text textAlign={`center`} fontSize="xs" color="gray.500">
                                No records found.
                            </Text>
                        </Center>
                    )}
                </PopoverBody>
            </PopoverContent>
        </Popover>
    )
}
