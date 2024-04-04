import {
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    IconButton,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { NDR_ROUTE_MAP } from 'layouts/NDR/NDR-route-map'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { CiExport } from 'react-icons/ci'
import { MdFilterAlt } from 'react-icons/md'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { useFilterContext } from '../FilterProvider'
import { useMutateNdrExport } from '../hooks/mutations'
import { useFilters } from '../hooks/queries'
import useDeviations from '../hooks/useDeviations'
import { CustomFilters as CustomFiltersType } from '../types/filters'
import { TAB_STATUS } from '../utils'
import CustomFilters from './CustomFilters'
import PageFilters from './PageFilters'

type Props = {
    tabIndex: number
}

function findTabKey(tabIndex: number) {
    const currentTab = Object.keys(NDR_ROUTE_MAP).find(
        (route) => NDR_ROUTE_MAP[route as keyof typeof NDR_ROUTE_MAP].index === tabIndex,
    )
    return NDR_ROUTE_MAP[currentTab as keyof typeof NDR_ROUTE_MAP].key
}

export default function FilterBar({ tabIndex }: Props) {
    const { data, isLoading, isError } = useFilters()
    const { isOpen, onOpen, onClose } = useDisclosure()

    const [localCustomFilters, setLocalCustomFilters] = useState<CustomFiltersType>({})
    const { customFilters, setCustomFilters } = useFilterContext()

    const exportNdrMutation = useMutateNdrExport()

    const deviations = useDeviations(
        customFilters,
        data?.filter((filter) => filter.page_key === findTabKey(tabIndex)),
    )

    const handleExport = () => {
        toast.success('Export generated successfully.', {
            position: 'top-right',
        })
        exportNdrMutation.mutate(TAB_STATUS[tabIndex])
    }

    return (
        <Flex>
            {/* Page Filters */}
            <PageFilters filters={data?.filter((filter) => filter.page_key === 'NDR_PAGE_FILTER') ?? []} />

            {/* Custom Filters */}
            <Tooltip hasArrow label="Filters">
                <IconButton
                    aria-label="filters"
                    icon={
                        <>
                            <MdFilterAlt />
                            {deviations ? (
                                <Text position={'absolute'} w={2} h={2} bottom={2} right={1} fontSize={'xx-small'}>
                                    {deviations}
                                </Text>
                            ) : (
                                <></>
                            )}
                        </>
                    }
                    size="sm"
                    onClick={onOpen}
                ></IconButton>
            </Tooltip>

            <Tooltip hasArrow label="Export">
                <IconButton
                    aria-label="export"
                    ms={2}
                    icon={
                        <>
                            <CiExport />
                        </>
                    }
                    size="sm"
                    onClick={handleExport}
                ></IconButton>
            </Tooltip>

            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                <DrawerOverlay transform="none !important" />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2} px={4} bg={`gray.100`}>
                        Filters
                    </DrawerHeader>

                    <DrawerBody>
                        {isLoading && (
                            <Center h={'100%'}>
                                <Loading />
                            </Center>
                        )}
                        {isError && (
                            <Center h={'100%'}>
                                <ErrorPlaceholder message="Filters unavailable! Please try again later." />
                            </Center>
                        )}
                        {data && (
                            <>
                                <CustomFilters
                                    filters={data.filter((filter) => filter.page_key === findTabKey(tabIndex))}
                                    customFilters={localCustomFilters}
                                    setCustomFilters={setLocalCustomFilters}
                                />
                                <Button
                                    size={'xs'}
                                    h={`28px`}
                                    mb={4}
                                    w={'100%'}
                                    isDisabled={Object.keys(localCustomFilters).every(
                                        (key) =>
                                            JSON.stringify(localCustomFilters[key].value) ==
                                            JSON.stringify(INIT_VALUE_MAP[localCustomFilters[key].type]),
                                    )}
                                    onClick={() => {
                                        setLocalCustomFilters({})
                                        setCustomFilters({})
                                        onClose()
                                    }}
                                >
                                    Reset all
                                </Button>
                            </>
                        )}
                    </DrawerBody>

                    <DrawerFooter
                        py={2}
                        px={4}
                        bg={`gray.100`}
                        justifyContent={'flex-start'}
                        borderTop={'1px solid var(--chakra-colors-gray-200)'}
                    >
                        <Flex justify="flex-start">
                            <Button
                                mr={4}
                                colorScheme={'teal'}
                                onClick={() => {
                                    setCustomFilters(localCustomFilters)
                                    onClose()
                                }}
                                size={'xs'}
                                h={`28px`}
                            >
                                Search
                            </Button>
                            <Button bg={`white`} variant={'outline'} onClick={onClose} size={'xs'} h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </Flex>
    )
}
