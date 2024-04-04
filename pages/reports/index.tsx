import { Center, Flex, Skeleton } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { fetchDownloadableReports, fetchExportItems } from 'apis/get'
import FormFilter from 'page-modules/reports/components/FormFilter/FormFilter'
import SelectReportType from 'page-modules/reports/components/SelectReportType/SelectReportType'
import { exportJobPayload, useMutateReportDownloader } from 'page-modules/reports/hooks/queries'
import { Filter, State, columnType, fetchExportItemApiResponse } from 'page-modules/reports/type/reports'
import {
    addColumnsToPayload,
    createColumnTypeMap,
    getPayloadFilters,
    initialState,
    setFilters,
} from 'page-modules/reports/utils'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import PageCard from 'shared/components/PageCard/PageCard'
import FormSkelton from 'shared/components/Skeletons/FormSkeleton'

import SelectColumns from '../../page-modules/reports/components/SelectColumns/SelectColumns'

export default function Reports() {
    const mutation = useMutateReportDownloader()
    const [state, setState] = useState<State>(initialState)
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false)

    const {
        data,
        isLoading: isExportItemsLoading,
        isError: isExportItemsError,
    } = useQuery({
        queryKey: ['fetch-downloadable-reports'],
        queryFn: () => fetchDownloadableReports(),
        refetchOnWindowFocus: false,
        refetchInterval: false,
    })

    const updateState = (newState: State) => {
        setState((prevState) => ({
            ...prevState,
            ...newState,
        }))
    }
    const updateSelectAll = (newSelectAll: boolean) => {
        setState((prevState) => ({
            ...prevState,
            selectAll: newSelectAll,
        }))
    }
    const updateSelectedColumns = (newSelectedColumns: columnType[]) => {
        setState((prevState) => ({
            ...prevState,
            selectedColumns: newSelectedColumns,
        }))
    }

    const handleQuerySuccess = (data: fetchExportItemApiResponse) => {
        const filtersData: Filter[] = Array.isArray(data.filters) ? setFilters(data) : []
        const columnTypeMapping = Array.isArray(data.filters)
            ? createColumnTypeMap(data.filters)
            : initialState.columnTypeMapping
        updateState({
            FILTERS: filtersData,
            availableColumns: data.columns,
            selectedColumns: data.columns,
            columnTypeMapping: columnTypeMapping,
            selectAll: state.selectAll,
            selectedReport: state.selectedReport,
        })
    }
    const { refetch, isLoading, isError, error } = useQuery({
        queryKey: ['exportItems'],
        queryFn: () => fetchExportItems(state.selectedReport),
        enabled: false,
        retry: 0,
        onSuccess: handleQuerySuccess,
    })
    const updateSelectedReport = (selectedReport: string) => {
        setState((prevState) => ({
            ...prevState,
            selectedReport: selectedReport,
        }))
    }
    const handleSelectReport = (event: ChangeEvent<HTMLSelectElement>) => {
        updateSelectedReport(event.target.value)
    }

    useEffect(() => {
        if (state.selectedReport) {
            refetch() // Trigger the API call manually
        }
        setIsButtonDisabled(state.selectedReport ? false : true)
    }, [state.selectedReport, refetch])
    useEffect(() => {
        if (state.selectedColumns.length === 0) {
            setIsButtonDisabled(true)
        } else {
            if (isButtonDisabled) {
                setIsButtonDisabled(false)
            }
        }
    }, [state.selectedColumns])

    const handleInitDownloadReport = (payload: exportJobPayload) => {
        mutation.mutate(payload, {
            onSuccess: () => {
                toast.success('Report generated successfully.', { position: 'top-right' })
            },
        })
    }
    const handleFormSubmit = (values: { [key: string]: any }) => {
        const payload: exportJobPayload = {
            name: state.selectedReport,
            columns: [],
            filters: [],
        }
        payload.filters = getPayloadFilters(values, state.columnTypeMapping)
        payload.columns = addColumnsToPayload(state.selectedColumns)
        handleInitDownloadReport(payload)
    }
    const filterFormText = 'Filters you want to apply in the report'
    const pageTitle = 'Reports'
    const pageSubtitle = 'Download specific reports'

    const selectColumnsProp = {
        title: ' Select the columns you want to include in the report',
        isShowSelectAll: true,
        selectAll: state.selectAll,
        availableColumns: state.availableColumns,
        selectedColumns: state.selectedColumns,
        updateSelectedColumns: updateSelectedColumns,
        updateSelectAll: updateSelectAll,
        titleStyle: {
            fontSize: 'xs',
            color: 'gray.800',
        },
    }
    const memoizedSelectColumns = useMemo(() => <SelectColumns {...selectColumnsProp} />, [selectColumnsProp])

    const formFilterProp = {
        filterFormText: filterFormText,
        handleFormSubmit: handleFormSubmit,
        filters: state.FILTERS,
        selectedColumns: state.selectedColumns,
        selectedReport: state.selectedReport,
        isButtonDisabled: isButtonDisabled,
    }
    const memoizedFormFilters = useMemo(() => <FormFilter {...formFilterProp} />, [formFilterProp])

    if (isExportItemsLoading)
        return (
            <PageCard title={pageTitle} subtitle={pageSubtitle} cardStyles={{ overflowY: 'auto' }}>
                <Flex overflowY={'auto'} p={4} flexDirection={'column'}>
                    <FormSkelton rows="1" columns="1" colWidth="200" />
                </Flex>
            </PageCard>
        )

    if (isExportItemsError)
        return (
            <Center h="400px">
                <ErrorPlaceholder />
            </Center>
        )
    return (
        <PageCard title={'Reports'} subtitle={`Download specific reports`} cardStyles={{ overflowY: 'auto' }}>
            <Flex p={4} flexDir="column">
                <SelectReportType
                    title="Select Report Type"
                    data={data}
                    handleSelectReport={handleSelectReport}
                    selectWidth="300px"
                    selectSize="md"
                    selectFontSize="medium"
                    selectBackground="gray.200"
                    selectBorderRadius="0.5rem"
                    selectHeight="32px"
                />
                <br />
                <Flex flexDirection={'column'}>
                    {!isLoading && !isError && state.availableColumns.length ? (
                        memoizedSelectColumns
                    ) : isLoading && state.selectedReport ? (
                        <>
                            <Skeleton height="20px" mb={4} width="200px" />
                            <Skeleton mb={4} height="20px" width="100px" />
                            <FormSkelton rows="2" columns="4" />
                        </>
                    ) : null}
                    <br />
                    {!isLoading && !isError && state.FILTERS.length ? (
                        memoizedFormFilters
                    ) : isLoading && state.selectedReport ? (
                        <>
                            <Skeleton height="20px" mt={4} width="200px" />
                            <FormSkelton rows="1" columns="4" />
                            <Skeleton height="20px" mt={4} width="100px" />
                        </>
                    ) : state.selectedReport && error ? (
                        <Center h="400px">
                            <ErrorPlaceholder />
                        </Center>
                    ) : null}
                </Flex>
            </Flex>
        </PageCard>
    )
}
