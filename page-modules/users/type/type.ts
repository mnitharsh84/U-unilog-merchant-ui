export type ActionParams = {
    fxnName: string
    fxnParams: Array<any>
}

export type RolesType = {
    code: string
    name: string
    type: string
}

export type RolesApiResponseType = {
    data: RolesType[]
}

export type ActionData = {
    rowIndex: number
}

export type TeamType = {
    teamId: string
    teamName: string
    roles: RolesType[]
    users: Array<any>
}
export type DataResponse = {
    data: TeamType
}

export type TeamApiResponse = {
    data: DataResponse
}

export type EditUserPayload = {
    userId: string
    teamId: string
    firstName: string
    lastName: string
    tenantCode?: string
    enable?: boolean
}

export type CreateUserPayload = {
    emailId: string
    password: string
    username: string
    firstName: string
    lastName: string
    tenantCode?: string
    admin?: boolean
}

export type AssociateUserToTeamPayload = {
    userId: string
    teamId: string
    enable: boolean
}

export type User = {
    email: string
    firstName: string
    lastName: string
    userId: string
    username: string
}

export type DoActionAllUserType = {
    action: string
    user: User
}

export type UserActionData = {
    userId: string
    action: string
    values: {
        email?: string
        firstName: string
        lastName: string
        userId?: string
        username?: string
    }
}

export type SearchUserApiResponse = {
    data: {
        data: User[]
    }
}
