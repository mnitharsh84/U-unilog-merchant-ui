import { TeamType } from 'page-modules/users/type/type'
import { Action } from 'shared/types/table'

export type Functions = {
    edit: (param: Array<any>) => void
    delete: (param: Array<any>) => void
    viewUsers: (param: Array<any>) => void
}

export type InitialState = TeamType & {
    actions: Action
}
