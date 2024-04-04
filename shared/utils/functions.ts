import { ExtendedFormField, FieldOptions, FieldType, dateRange, selectOption } from 'shared/types/forms'
import { Schema } from 'yup'
import * as Yup from 'yup'

import { MEDIA } from './enums'

export function parseDate(date: string | null | undefined): string {
    if (!date) return '-'

    return new Date(date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

export const getType = (type: string): FieldType => {
    switch (type) {
        case 'SELECT':
            return 'select'
        case 'SELECT_BOX':
            return 'select'
        case 'MULTISELECT':
            return 'multi_select'
        case 'MULTI_SELECT_BOX':
            return 'multi_select'
        case 'MULTI_INPUT_BOX':
            return 'text_input'
        case 'INPUT_BOX':
            return 'text_input'
        case 'TEXT':
            return 'text_input'
        case 'DATE':
            return 'date'
        case 'DATERANGE':
            return 'daterange'
        case 'BOOLEAN':
            return 'select'
        default:
            return 'text_input'
    }
}

export const createValidation = (field: ExtendedFormField<any>): Schema | undefined => {
    let validationSchema: Schema | undefined
    if (
        field.type.toUpperCase() === 'TEXT' ||
        field.type.toUpperCase() === 'TEXT_INPUT' ||
        field.type.toUpperCase() === 'DATE' ||
        field.type.toUpperCase() === 'BOOLEAN'
    ) {
        if (field.required) {
            validationSchema = Yup.string().required(`${field.display} is required`)
        }
    } else if (field.type.toUpperCase() === 'DATERANGE') {
        if (field.required) {
            validationSchema = Yup.object().shape({
                startDate: Yup.date().nullable().required('Please select a start date'),
                endDate: Yup.date().nullable().required('Please select an end date'),
            })
        }
    } else if (field.type.toUpperCase() === 'SELECT') {
        if (field.required) {
            validationSchema = Yup.string().required(`${field.display} is required`)
        }
    } else if (field.type.toUpperCase() === 'MULTISELECT' || field.type === 'multi_select') {
        if (field.required) {
            validationSchema = Yup.array().required('Required').min(1, `${field.display} is required`)
        }
    }

    return validationSchema
}

export const setOptionForBooleanField = (): FieldOptions[] => {
    const options: FieldOptions[] = [
        {
            key: 'true',
            display: 'True',
            hidden: false,
        },
        {
            key: 'false',
            display: 'False',
            hidden: false,
        },
    ]
    return options
}

export const setOptions = (options: selectOption[]): FieldOptions[] => {
    return options.map((option: selectOption) => {
        return {
            key: option.name,
            display: option.display_name,
            hidden: false,
        }
    })
}

export const convertDateToString = (date: Date) => {
    const mm = date.getMonth() + 1 // getMonth() is zero-based
    const dd = date.getDate()

    return [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
}

export const formatDateToCustomString = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options)
    return formattedDate
}

export function isDateRange(value: dateRange): value is dateRange {
    return (
        typeof value === 'object' &&
        value !== null &&
        'startDate' in value &&
        'endDate' in value &&
        (value.startDate === null || value.startDate instanceof Date) &&
        (value.endDate === null || value.endDate instanceof Date)
    )
}

export function getMediaType(fileName: string): MEDIA {
    if (fileName.endsWith('mp4') || fileName.endsWith('MOV')) return MEDIA.VIDEO

    return MEDIA.IMAGE
}

// const createRangeValidation = (field: ExtendedFormField<any>, validValues: string[]): Schema<string | undefined> => {
//     const validValuesSet = [...validValues]
//     return Yup.string()
//         .matches(
//             new RegExp(`^(\\s*(${validValuesSet.join('|')})\\s*,\\s*)*\\s*(${validValuesSet.join('|')})\\s*$`),
//             'Invalid format or values. Please use comma-separated values from the valid range.',
//         )
//         .required('This field is required') as Schema<string | undefined>
// }

export const dayDiffenceFromCurrentDate = (dataString: string) => {
    // Convert the fulfillmentDate string to a Date object
    const startData = new Date(dataString)
    const currentDate = new Date()
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - startData.getTime()
    // Convert milliseconds to days
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
}
