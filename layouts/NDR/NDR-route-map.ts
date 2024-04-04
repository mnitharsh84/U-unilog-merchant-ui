export const NDR_ROUTE_MAP = {
    'actions-required': {
        index: 0,
        breadcrumb: 'Actions Required',
        key: 'action_required',
    },
    'actions-requested': {
        index: 1,
        breadcrumb: 'Actions Requested',
        key: 'action_requested',
    },
    'delivered': {
        index: 2,
        breadcrumb: 'Delivered',
        key: 'delivered',
    },
    'rto': {
        index: 3,
        breadcrumb: 'RTO',
        key: 'rto',
    },
}

export type NDR_ROUTE_PATH = 'actions-required' | 'actions-requested' | 'delivered' | 'rto'
