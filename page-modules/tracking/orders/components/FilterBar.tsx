import { SearchIcon } from '@chakra-ui/icons'
import {
    Button,
    Flex,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Text,
    Tooltip,
    useDisclosure,
} from '@chakra-ui/react'
import { useIsFetching } from '@tanstack/react-query'
import { Dispatch, Reducer, SetStateAction, useReducer, useState } from 'react'
import { MdFilterAlt } from 'react-icons/md'

import { useDeviations } from '../hooks/custom'
import { ActionType, Actions, CustomFilters, DefaultFilters, Filters } from '../types/filters'
import { INIT_CUSTOM_FILTER_VALUES, INIT_DEFAULT_FILTER_VALUES } from '../utils'
import FilterDrawer from './FilterDrawer'
import MoreOptions from './MoreOptions'

type Props = {
    filters: Filters
    setFilters: Dispatch<SetStateAction<Filters>>
}

function reducer(state: DefaultFilters, { type, payload }: Actions): DefaultFilters {
    switch (type) {
        case ActionType.SET_TO:
            return { ...state, to: payload }
        case ActionType.SET_FROM:
            return { ...state, from: payload }
        case ActionType.SET_SORT:
            return { ...state, sortBy: payload }
        case ActionType.SET_TIMELINE:
            return { ...state, timeline: payload }
        case ActionType.SET_FILTERS:
            return { ...state, filterBy: payload }
        case ActionType.SET_SEARCH_TEXT:
            return { ...state, searchText: payload }
        case ActionType.RESET_FILTERS:
            return {
                ...state,
                to: INIT_DEFAULT_FILTER_VALUES.to,
                from: INIT_DEFAULT_FILTER_VALUES.from,
                sortBy: INIT_DEFAULT_FILTER_VALUES.sortBy,
                filterBy: INIT_DEFAULT_FILTER_VALUES.filterBy,
                timeline: INIT_DEFAULT_FILTER_VALUES.timeline,
                ...payload,
            }
        default:
            return state
    }
}

export default function FilterBar({ filters, setFilters }: Props) {
    const [defaultFilters, dispatchDefaultFilterChange] = useReducer<Reducer<DefaultFilters, Actions>>(
        reducer,
        INIT_DEFAULT_FILTER_VALUES,
    )

    const [customFilters, setCustomFilters] = useState<CustomFilters>({})

    const deviations = useDeviations(filters)

    const filterDrawerControls = useDisclosure()

    const isShipmentsFetching = useIsFetching({ queryKey: ['shipments'] })

    function applyFilters(
        wasReset = false,
        defaultFilterValues?: Partial<DefaultFilters>,
        customFilterValues?: CustomFilters,
    ) {
        if (wasReset) {
            resetFilters(defaultFilterValues, customFilterValues)
            setFilters({
                ...INIT_DEFAULT_FILTER_VALUES,
                ...defaultFilterValues,
                searchText: defaultFilters.searchText,
                customFilters: INIT_CUSTOM_FILTER_VALUES,
            })
        } else setFilters({ ...defaultFilters, customFilters: customFilters })
    }

    function resetFilters(defaultFilterValues?: Partial<DefaultFilters>, customFilterValues?: CustomFilters) {
        dispatchDefaultFilterChange({ type: ActionType.RESET_FILTERS, payload: defaultFilterValues })
        setCustomFilters({ ...INIT_CUSTOM_FILTER_VALUES, ...customFilterValues })
    }

    return (
        <>
            <Flex justifyContent="flex-end" align="center" gap="1rem">
                <InputGroup w={'30%'}>
                    <InputLeftElement pointerEvents="none" top="-0.25rem">
                        <SearchIcon color="gray.300" fontSize="sm" />
                    </InputLeftElement>
                    <Input
                        borderRadius={'0.3rem'}
                        value={defaultFilters.searchText}
                        placeholder="Search AWB/Order/Phone/Facility/Courier"
                        size="sm"
                        onChange={(e) =>
                            dispatchDefaultFilterChange({
                                type: ActionType.SET_SEARCH_TEXT,
                                payload: e.target.value,
                            })
                        }
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                const timeline = e.currentTarget.value ? 'last_90_days' : 'last_7_days'
                                applyFilters(true, { timeline })
                            }
                        }}
                    />
                </InputGroup>
                <Flex gap={4}>
                    <Tooltip hasArrow label="Filters">
                        <IconButton
                            aria-label="filters"
                            icon={
                                <>
                                    <MdFilterAlt />
                                    {deviations ? (
                                        <Text
                                            position={'absolute'}
                                            w={2}
                                            h={2}
                                            bottom={2}
                                            right={1}
                                            fontSize={'xx-small'}
                                        >
                                            {deviations}
                                        </Text>
                                    ) : (
                                        <></>
                                    )}
                                </>
                            }
                            size="sm"
                            onClick={filterDrawerControls.onOpen}
                        ></IconButton>
                    </Tooltip>
                    <Button
                        size="sm"
                        colorScheme="teal"
                        isLoading={!!isShipmentsFetching}
                        onClick={() => applyFilters()}
                    >
                        Search
                    </Button>
                    <MoreOptions filters={filters} />
                </Flex>
            </Flex>
            <FilterDrawer
                controls={filterDrawerControls}
                defaultFilters={defaultFilters}
                dispatchDefaultFilterChange={dispatchDefaultFilterChange}
                customFilters={customFilters}
                setCustomFilters={setCustomFilters}
                applyFilters={applyFilters}
            />
        </>
    )
}
