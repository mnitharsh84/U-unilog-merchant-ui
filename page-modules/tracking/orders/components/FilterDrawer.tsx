import {
    Button,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
} from '@chakra-ui/react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { Actions, CustomFilters, DefaultFilters } from '../types/filters'
import { INIT_DEFAULT_FILTER_VALUES } from '../utils'
import CustomFiltersComponent from './CustomFiltersComponent'
import DefaultFiltersComponent from './DefaultFiltersComponent'

type Props = {
    controls: {
        isOpen: boolean
        onClose: () => void
    }
    defaultFilters: DefaultFilters
    dispatchDefaultFilterChange: Dispatch<Actions>
    customFilters: CustomFilters
    setCustomFilters: Dispatch<SetStateAction<CustomFilters>>
    applyFilters: (wasReset?: boolean) => void
}

export default function FilterDrawer({
    controls,
    defaultFilters,
    dispatchDefaultFilterChange,
    customFilters,
    setCustomFilters,
    applyFilters,
}: Props) {
    const [haveFiltersChanged, setHaveFiltersChanged] = useState<boolean>(false)

    useEffect(() => {
        function haveRelevantDefaultFiltersChanged(): boolean {
            return (
                JSON.stringify(defaultFilters.filterBy) !== JSON.stringify(INIT_DEFAULT_FILTER_VALUES.filterBy) ||
                defaultFilters.sortBy !== INIT_DEFAULT_FILTER_VALUES.sortBy ||
                defaultFilters.timeline !== INIT_DEFAULT_FILTER_VALUES.timeline
            )
        }

        function haveCustomFiltersChanged(): boolean {
            return Object.keys(customFilters).some((filterKey) => {
                if (
                    JSON.stringify(customFilters[filterKey].value) !==
                    JSON.stringify(INIT_VALUE_MAP[customFilters[filterKey].type])
                )
                    return true
            })
        }

        if (haveRelevantDefaultFiltersChanged() || haveCustomFiltersChanged()) setHaveFiltersChanged(true)
        else setHaveFiltersChanged(false)
    }, [defaultFilters, customFilters])

    function validateFilters() {
        if (defaultFilters.timeline === 'custom') {
            const days90InMiliSeconds = 90 * 24 * 60 * 60 * 1000

            if (!defaultFilters.from || !defaultFilters.to) throw new Error('Please select custom time range')

            if (new Date(defaultFilters.from).getTime() + days90InMiliSeconds < new Date(defaultFilters.to).getTime())
                throw new Error('Maximum time range is 90 days')

            if (new Date(defaultFilters.from).getTime() > new Date(defaultFilters.to).getTime())
                throw new Error('Invalid date range')
        }
    }

    return (
        <Drawer isOpen={controls.isOpen} onClose={controls.onClose} placement={'right'} size={'md'}>
            <DrawerOverlay transform={'none !important'} />
            <DrawerContent transform={'none !important'}>
                <DrawerCloseButton size={'sm'} />

                <DrawerHeader py={2} px={4} bg={`gray.100`} fontSize={'sm'}>
                    Filter Records
                </DrawerHeader>

                <DrawerBody>
                    <DefaultFiltersComponent filters={defaultFilters} dispatch={dispatchDefaultFilterChange} />
                    <CustomFiltersComponent filters={customFilters} setFilters={setCustomFilters} />
                    <Button
                        size={'xs'}
                        h={`28px`}
                        mb={4}
                        w={'100%'}
                        isDisabled={!haveFiltersChanged}
                        onClick={() => {
                            controls.onClose()
                            applyFilters(true)
                        }}
                    >
                        Reset all
                    </Button>
                </DrawerBody>

                <DrawerFooter
                    py={2}
                    px={4}
                    bg={`gray.100`}
                    justifyContent={'flex-start'}
                    borderTop={'1px solid var(--chakra-colors-gray-200)'}
                >
                    <Flex justify="flex-start" w="100%">
                        <Button
                            mr={4}
                            colorScheme={'teal'}
                            onClick={() => {
                                try {
                                    validateFilters()
                                    applyFilters()
                                    controls.onClose()
                                } catch (err) {
                                    toast.error(String(err ?? 'Invalid Filters'))
                                }
                            }}
                            size={'xs'}
                            h={`28px`}
                            flex="1"
                        >
                            Search
                        </Button>
                        <Button
                            flex="1"
                            bg={`white`}
                            variant={'outline'}
                            onClick={controls.onClose}
                            size={'xs'}
                            h={`28px`}
                        >
                            Close
                        </Button>
                    </Flex>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}
