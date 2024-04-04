import gateway from 'apis/gateway'

export async function postRequest(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}
export async function patchRequest(url: string, data: any): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'PATCH', headers, body: JSON.stringify(data) })
}
