import gateway from 'apis/gateway'
import { ConvertExchangePayload, ConvertToExchangeApiResponse } from 'page-modules/return/type/return'

export async function convertToExchangePostAction(
    url: string,
    data: ConvertExchangePayload,
): Promise<ConvertToExchangeApiResponse> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    return await gateway(url, { method: 'POST', headers, body: JSON.stringify(data) })
}
