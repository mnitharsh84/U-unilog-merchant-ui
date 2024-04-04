import { Field, FieldType, FieldTypeToValue } from 'shared/types/form'
import * as Yup from 'yup'
import { Schema } from 'yup'

// this is an identity function
export function getField<Type extends keyof FieldTypeToValue>(arg: Field<Type>): Field<Type> {
    return arg
}

export const getInitialValues = (fields: Field<FieldType>[]) => {
    return fields.reduce<Record<string, unknown>>((acc, curr) => {
        return {
            ...acc,
            [curr.fieldKey]: curr.init_value,
        }
    }, {})
}

// export const getValidationSchema = (fields: Field<FieldType>[]) => {
//     return Yup.object().shape(
//         fields.reduce<Record<string, Schema|undefined>>((acc, curr) => {
//             return {
//                 ...acc,
//                 [curr.fieldKey]: curr.validationSchema,
//             }
//         }, {}),
//     )
// }
export const getValidationSchema = (fields: Field<any>[]) => {
    return Yup.object().shape(
        fields.reduce<Record<string, Schema>>((acc, curr) => {
            if (curr.validationSchema) {
                acc[curr.fieldKey] = curr.validationSchema
            }
            return acc
        }, {}),
    )
}
