import { RolesType } from './type'

export type createTeamPayload = {
    teamName: string
    tenantCode?: string
    roleCodes: string[]
}

export type editTeamPayload = {
    teamId: string
    teamName: string
    enable?: boolean
    tenantCode?: string
    roleCodes: Array<any>
}

export type createTeamFormData = {
    name: string
}

export type DoActionParams = {
    values?: createTeamFormData
    selectedRoles?: Array<RolesType> | undefined
    action: string
    teamId?: string
    enabled?: boolean
}
