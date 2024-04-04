import DomainHandler from 'apis/domain-handler'
import gateway from 'apis/gateway'
import { CustomFilters, ExchangeResponse, ExchangeTabStatus, RMSTYPE } from 'page-modules/exchange/type/exchange'

const domainHandler = new DomainHandler()

export async function fetchSellerExchnageData({
    page,
    page_size,
    is_web,
    query_string,
    from,
    to,
    rms_page,
    rms_type,
    customFilters,
}: {
    page: number
    page_size: number
    is_web: boolean
    query_string: string
    from: string
    to: string
    rms_page: ExchangeTabStatus
    rms_type: RMSTYPE
    customFilters: CustomFilters
}): Promise<ExchangeResponse> {
    return gateway(
        `session/api/v1/rms/seller/exchange-order/data?page=${domainHandler.encodeUriParams(
            page,
        )}&page_size=${domainHandler.encodeUriParams(page_size)}&is_web=${domainHandler.encodeUriParams(
            is_web,
        )}&rms_page=${domainHandler.encodeUriParams(rms_page)}&rms_type=${domainHandler.encodeUriParams(
            rms_type,
        )}&query_string=${domainHandler.encodeUriParams(query_string)}&from=${domainHandler.encodeUriParams(
            from,
        )}&to=${domainHandler.encodeUriParams(to)}${Object.keys(customFilters).reduce<string>(
            (prev, key) => prev + `&${key}=${domainHandler.encodeUriParams(customFilters[key].value)}`,
            '',
        )}`,
        {
            method: 'GET',
        },
    )
}

export async function getExchangeOrder(url: string): Promise<any> {
    return await gateway(url, { method: 'GET' })
}
