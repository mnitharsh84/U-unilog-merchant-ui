import { TabDetail } from 'shared/types/tabs'

export const BUYER_ROUTE_MAP: { [key: string]: TabDetail } = {
    reattempt: {
        index: 0,
        breadcrumb: 'Reattempt',
        key: 'reattempt',
    },
    rto: {
        index: 1,
        breadcrumb: 'RTO',
        key: 'rto',
    },
}

export type BUYER_ROUTE_PATH = 'reattempt' | 'rto'

export const TAB_NAME_MAP: { [key: string]: any } = {
    reattempt: {
        view: 'All Reattempt',
    },
    rto: {
        view: 'All RTO',
    },
}
