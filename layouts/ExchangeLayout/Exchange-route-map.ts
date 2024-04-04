import { TabDetail } from 'shared/types/tabs'

export const EXCHANGE_ROUTE_MAP: { [key: string]: TabDetail } = {
    requested: {
        index: 0,
        breadcrumb: 'Requested',
        key: 'requested',
    },
    approved: {
        index: 1,
        breadcrumb: 'Approved',
        key: 'approved',
    },
    rejected: {
        index: 2,
        breadcrumb: 'Rejected',
        key: 'rejected',
    },
    exchanged: {
        index: 3,
        breadcrumb: 'Exchanged',
        key: 'completed',
    },
    deleted: {
        index: 4,
        breadcrumb: 'Deleted',
        key: 'deleted',
    },
}

export type EXCHANGE_ROUTE_PATH = 'requested' | 'approved' | 'rejected' | 'exchanged' | 'deleted'

export const EXCHANGE_VIEW_PAGE_MAP: { [key: string]: TabDetail } = {
    view: {
        index: 0,
        breadcrumb: 'Details',
        key: 'Details',
    },
    activity: {
        index: 1,
        breadcrumb: 'Activity',
        key: 'activity',
    },
}

export const TAB_NAME_MAP: { [key: string]: any } = {
    requested: {
        view: 'All Requested',
    },
    approved: {
        view: 'All Approved',
    },
    rejected: {
        view: 'All Rejected',
    },
    exchanged: {
        view: 'All EXCHANGED',
    },
}

export type EXCHANGE_VIEW_PATH = 'details' | 'activity'
