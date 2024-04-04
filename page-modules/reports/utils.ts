import { payloadFilter } from 'page-modules/reports/hooks/queries'
import { getType, setOptionForBooleanField, setOptions } from 'shared/utils/functions'
import * as Yup from 'yup'
import { Schema } from 'yup'

import { Filter, State, columnType, dateRange, exportItemFiltertype, fetchExportItemApiResponse } from './type/reports'

export const initialState: State = {
    selectedReport: null,
    FILTERS: [],
    availableColumns: [],
    selectAll: true,
    selectedColumns: [],
    columnTypeMapping: {},
}

export const setInitalValue = (filters: Array<Filter>) => {
    const intialValue: { [key: string]: string | object | Array<string> | boolean } = {}
    filters.map((filter) => {
        if (filter.type === 'text_input' || filter.type === 'date' || filter.type === 'select') {
            intialValue[filter.key] = ''
        } else if (filter.type === 'daterange') {
            intialValue[filter.key] = { startDate: null, endDate: null }
        } else if (filter.type === 'multi_select') {
            intialValue[filter.key] = []
        }
    })
    return intialValue
}
export const addColumnsToPayload = (selectedColumns: columnType[]): string[] => {
    const columns: string[] = []
    for (const column of selectedColumns) {
        columns.push(column.name)
    }
    return columns
}
function isDateRange(value: dateRange): value is dateRange {
    return (
        typeof value === 'object' &&
        value !== null &&
        'startDate' in value &&
        'endDate' in value &&
        (value.startDate === null || value.startDate instanceof Date) &&
        (value.endDate === null || value.endDate instanceof Date)
    )
}
export const getPayloadFilters = (values: any, columnTypeMapping: { [key: string]: string }) => {
    const filters = []
    for (const key in values) {
        const filter: payloadFilter = {}
        if (
            columnTypeMapping[key].toUpperCase() === 'SELECT' ||
            columnTypeMapping[key].toUpperCase() === 'MULTISELECT'
        ) {
            filter['id'] = key
            filter['selected_values'] = Array.isArray(values[key]) ? values[key] : [values[key]]
            if (filter['selected_values'].length > 0) filters.push(filter)
        } else if (columnTypeMapping[key].toUpperCase() === 'DATERANGE' && isDateRange(values[key])) {
            filter['id'] = key
            filter['start'] = values[key]['startDate'] ? convertDateToString(values[key]['startDate']) : null
            filter['end'] = values[key]['endDate'] ? convertDateToString(values[key]['endDate']) : null
            if (filter['start'] && filter['end']) {
                filters.push(filter)
            }
        } else if (columnTypeMapping[key].toUpperCase() === 'DATE') {
            filter['id'] = key
            filter['start'] = values[key]
            if (values[key]) filters.push(filter)
        } else if (columnTypeMapping[key].toUpperCase() === 'TEXT') {
            filter['id'] = key
            filter['text'] = values[key]
            if (values[key]) filters.push(filter)
        } else if (columnTypeMapping[key].toUpperCase() === 'BOOLEAN') {
            filter['id'] = key
            filter['checked'] = values[key] === 'true' ? true : values[key] === 'false' ? false : null
            if (filter['checked'] !== null) {
                filters.push(filter)
            }
        }
    }
    return filters
}

export const createColumnTypeMap = (filters: Array<exportItemFiltertype>) => {
    const columnTypeMapping: { [key: string]: string } = {}
    filters.map((filter: exportItemFiltertype) => {
        columnTypeMapping[filter.id] = filter.type
    })
    return columnTypeMapping
}
export const createValidation = (filter: exportItemFiltertype): Schema | undefined => {
    let validationSchema: Schema | undefined
    if (filter.type === 'TEXT' || filter.type === 'DATE' || filter.type === 'BOOLEAN') {
        if (filter.required) {
            validationSchema = Yup.string().required(`${filter.display_name} is required`)
        }
    } else if (filter.type === 'DATERANGE') {
        if (filter.required) {
            validationSchema = Yup.object().shape({
                startDate: Yup.date().nullable().required('Please select a start date'),
                endDate: Yup.date().nullable().required('Please select an end date'),
            })
        }
    } else if (filter.type === 'SELECT') {
        if (filter.required) {
            validationSchema = Yup.string().required(`${filter.display_name} is required`)
        }
    } else if (filter.type === 'MULTISELECT') {
        if (filter.required) {
            validationSchema = Yup.array().required('Required').min(1, `${filter.display_name} is required`)
        }
    }

    return validationSchema
}
export const setFilters = (data: fetchExportItemApiResponse): Array<Filter> => {
    const filtersData = data.filters.map((filter: exportItemFiltertype) => {
        return {
            key: filter.id,
            display: filter.display_name,
            initValue: null,
            type: getType(filter.type),
            required: filter.required,
            validation: createValidation(filter),
            options: filter.options
                ? setOptions(filter.options)
                : filter.type === 'BOOLEAN'
                ? setOptionForBooleanField()
                : [],
        }
    })
    return filtersData
}

export const convertDateToString = (date: Date) => {
    const mm = date.getMonth() + 1 // getMonth() is zero-based
    const dd = date.getDate()

    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
}
