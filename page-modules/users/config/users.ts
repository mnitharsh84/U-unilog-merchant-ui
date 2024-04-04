import { FieldType, formField } from 'shared/types/forms'
import * as Yup from 'yup'

const firstName = {
    key: 'firstName',
    display: 'First Name',
    initValue: '',
    placeHolder: 'Enter First Name',
    type: 'text_input' as FieldType,
    validation: Yup.string().required('First Name is required').max(50, 'First Name must be at most 50 characters'),
    required: true,
    showErrorMessage: true,
}
const lastName = {
    key: 'lastName',
    display: 'Last Name',
    initValue: '',
    placeHolder: 'Enter Last Name',
    type: 'text_input' as FieldType,
    validation: Yup.string().required('Last Name is required').max(50, 'Last Name must be at most 50 characters'),
    required: true,
    showErrorMessage: true,
}
const username = {
    key: 'username',
    display: 'Username',
    initValue: '',
    placeHolder: 'Enter User Name',
    type: 'text_input' as FieldType,
    validation: Yup.string().required('Username is required').max(50, 'Username must be at most 50 characters'),
    required: true,
    showErrorMessage: true,
}

const password = {
    key: 'password',
    display: 'Password',
    initValue: '',
    placeHolder: 'Enter User Password',
    type: 'password_input' as FieldType,
    validation: Yup.string()
        .required('Password is required')
        .max(50, 'Password must be at most 50 characters')
        .min(8, 'Password must be at least 8 characters long'),
    required: true,
    showErrorMessage: true,
}

const email = {
    key: 'emailId',
    display: 'Email',
    initValue: '',
    placeHolder: 'Enter User Email',
    type: 'text_input' as FieldType,
    validation: Yup.string()
        .required('Email is required')
        .email('Invalid email format')
        .max(256, 'Password must be at most 256 characters'),
    required: true,
    showErrorMessage: true,
}

export const createUserFormFields: formField[] = [firstName, lastName, username, password, email]
export const editUserFormField: formField[] = [firstName, lastName]
