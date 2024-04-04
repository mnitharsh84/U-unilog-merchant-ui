import gateway from 'apis/gateway'

export type CreateImportType = {
    success: boolean
}
export async function createImport(formData: FormData): Promise<CreateImportType> {
    return await gateway(`session/api/v1/imports/create`, {
        method: 'POST',
        body: formData,
    })
}
