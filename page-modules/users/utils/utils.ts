import { User } from 'page-modules/users/type/type'
import { formField } from 'shared/types/forms'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

export const setInitialValueForCreateUserFields = (createUserFormFields: formField[]) => {
    createUserFormFields.map((formField: formField) => {
        formField.initValue = INIT_VALUE_MAP[formField.type]
    })
    return createUserFormFields
}

export const setEditUserFormFieldsInitalData = (user: User, formFields: formField[]) => {
    formFields.map((formField: formField) => {
        const key = formField.key as keyof User // Type assertion
        if (formField.key && user[key] !== undefined) {
            formField.initValue = user[key] ? user[key] : INIT_VALUE_MAP[formField.type]
        }
    })
}
