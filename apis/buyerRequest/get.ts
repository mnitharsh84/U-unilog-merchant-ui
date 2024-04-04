import DomainHandler from 'apis/domain-handler'
import gateway from 'apis/gateway'
import { BuyerRequestResponse, BuyerTabStatus } from 'page-modules/buyer/types/buyer'
import { CustomFilters } from 'shared/types/tabs'

const domainHandler = new DomainHandler()

export async function fetchBuyerRequestsData({
    page,
    page_size,
    is_web,
    query_string,
    from,
    to,
    ndr_action,
    customFilters,
}: {
    page: number
    page_size: number
    is_web: boolean
    query_string: string
    from: string
    to: string
    ndr_action: BuyerTabStatus
    customFilters: CustomFilters
}): Promise<BuyerRequestResponse> {
    return gateway(
        `session/api/v1/ndr/buyer-ndr-request?page=${domainHandler.encodeUriParams(
            page,
        )}&page_size=${domainHandler.encodeUriParams(page_size)}&is_web=${domainHandler.encodeUriParams(
            is_web,
        )}&ndr_action=${domainHandler.encodeUriParams(ndr_action)}&query_string=${domainHandler.encodeUriParams(
            query_string.trim(),
        )}&from=${domainHandler.encodeUriParams(from)}&to=${domainHandler.encodeUriParams(to)}${Object.keys(
            customFilters,
        ).reduce<string>(
            (prev, key) => prev + `&${key}=${domainHandler.encodeUriParams(customFilters[key].value)}`,
            '',
        )}`,
        {
            method: 'GET',
        },
    )
}
