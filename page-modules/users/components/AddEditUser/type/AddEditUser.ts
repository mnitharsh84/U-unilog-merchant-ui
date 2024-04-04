export type AddUserPayload = {
    emailId: string
    password: string
    username: string
    firstName: string
    lastName: string
    tenantCode?: string
    admin: true
}

export type user = {
    firstName: string
    lastName: string
    teamId: string
    userId: string
}

type intialDataType = {
    mode: string
    title: string
    user: user
}
