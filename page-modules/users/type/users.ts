import { User } from '../components/AllUsers/type/AllUsers'

export type formData = { [key: string]: string }

export type DoActionParams = {
    values?: formData
    action: string
    userId?: string
}

export type DoActionAddUserParams = {
    action: string
    user?: User
}
