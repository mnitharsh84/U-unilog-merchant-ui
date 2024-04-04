import DomainHandler from 'apis/domain-handler'
import gateway from 'apis/gateway'

const domainHandler = new DomainHandler()

export async function fetchImportTypes(): Promise<string[]> {
    return await gateway(`session/api/v1/imports/imports-list`, { method: 'GET' })
}

export type FetchImportConfigResponse = {
    columnList: {
        name: string
        description: string
        required: boolean
    }[]
}
export async function fetchImportConfig(importType: string): Promise<FetchImportConfigResponse> {
    return await gateway(`session/api/v1/imports/import-config?name=${domainHandler.encodeUriParams(importType)}`, {
        method: 'GET',
    })
}
