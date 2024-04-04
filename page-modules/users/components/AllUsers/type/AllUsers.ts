import { Action } from 'shared/types/table'

export type Functions = {
    edit: (param: Array<any>) => void
    delete: (param: Array<any>) => void
}

export type User = {
    email: string
    firstName: string
    lastName: string
    userId: string
    username: string
}

export type InitialState = User & {
    actions: Action
}
