import { CheckCircleIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
    Avatar,
    Box,
    Center,
    CircularProgress,
    Flex,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
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
import { CiExport } from 'react-icons/ci'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import BreadcrumbComp from '../Breadcrumb/Breadcrumb'
import Imports from './Imports'
import styles from './navbar.module.scss'
import { useExportProgress } from './queries'

export default function NavBar() {
    const { data, isLoading, isError, refetch } = useExportProgress()
    return (
        <Flex className={styles.NavBar} flexDir="row" justifyContent={'space-between'} align="center" px={4}>
            <Flex className={styles.leftSide} align="center" ps={2}>
                <BreadcrumbComp />
            </Flex>
            <Flex gap={4}>
                <Imports />
                <Popover placement="bottom-end" closeOnEsc={true} isLazy>
                    <PopoverTrigger>
                        <Box onClick={() => refetch()}>
                            <Tooltip label="Exports" hasArrow>
                                <IconButton
                                    aria-label="export"
                                    icon={<CiExport fontSize={'large'} />}
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
                                    Exports
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
                                        {file.completed && (
                                            <Link href={file.file_url} target="_blank" className={styles.exportLink}>
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
                                                                {formatDistanceToNow(new Date(file.timestamp), {
                                                                    addSuffix: true,
                                                                })}
                                                            </Tooltip>
                                                        </Text>
                                                    </Flex>

                                                    <Flex justify={`flex-end`}>
                                                        {file.completed ? (
                                                            <Tooltip label="Download" hasArrow={true}>
                                                                <CheckCircleIcon
                                                                    fontSize={'1rem'}
                                                                    color={'green.400'}
                                                                />
                                                            </Tooltip>
                                                        ) : (
                                                            <CircularProgress
                                                                className={styles.circularProgress}
                                                                isIndeterminate
                                                                color="#63b3ed"
                                                            />
                                                        )}
                                                    </Flex>
                                                </Flex>
                                            </Link>
                                        )}

                                        {!file.completed && (
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
                                                            {formatDistanceToNow(new Date(file.timestamp), {
                                                                addSuffix: true,
                                                            })}
                                                        </Tooltip>
                                                    </Text>
                                                </Flex>

                                                <Flex justify={`flex-end`}>
                                                    {file.completed ? (
                                                        <Tooltip label="Download" hasArrow={true}>
                                                            <CheckCircleIcon fontSize={'1rem'} color={'green.400'} />
                                                        </Tooltip>
                                                    ) : (
                                                        <CircularProgress
                                                            className={styles.circularProgress}
                                                            isIndeterminate
                                                            color="#63b3ed"
                                                        />
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
                <Menu autoSelect={false}>
                    <MenuButton>
                        <Avatar size="xs"></Avatar>
                        <ChevronDownIcon color="gray.500" />
                    </MenuButton>
                    <MenuList>
                        <MenuItem fontSize="sm" className={styles.menu}>
                            <Link
                                href="https://unilog.unicommerce.com/admin"
                                target="_blank"
                                rel="noreferrer"
                                className={styles.link}
                            >
                                Settings
                            </Link>
                        </MenuItem>
                        <MenuItem fontSize="sm">User Info</MenuItem>
                        <MenuItem fontSize="sm" className={styles.menu}>
                            <Link href="/logout" className={styles.link}>
                                Logout
                            </Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}
