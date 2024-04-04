import { FieldType, FieldValue } from 'shared/types/forms'

export type SortParams =
    | 'order_date'
    | 'dispatch_date'
    | 'delivery_date'
    | 'expected_delivery_date'
    | 'total_delivery_time'

export type FilterParams =
    | 'delivery_today'
    | 'sla_breached'
    | 'in_transit'
    | 'out_for_delivery'
    | 'delivered'
    | 'has_delivery_failed'

export type TimelineParams = 'last_7_days' | 'last_month' | 'last_90_days' | 'custom'

export type DefaultFilters = {
    to: string // YYYY-MM--DD
    from: string // YYYY-MM--DD
    sortBy: SortParams | ''
    timeline: TimelineParams
    filterBy: FilterParams[]
    searchText: string
}

export type CustomFilters = {
    [key: string]: {
        type: FieldType
        value: FieldValue
    }
}

export type Filters = DefaultFilters & { customFilters: CustomFilters }

export enum ActionType {
    SET_TO = 'SET_TO',
    SET_FROM = 'SET_FROM',
    SET_SORT = 'SET_SORT',
    SET_TIMELINE = 'SET_TIMELINE',
    SET_FILTERS = 'SET_FILTERS',
    SET_SEARCH_TEXT = 'SET_SEARCH_TEXT',
    RESET_FILTERS = 'RESET_FILTERS',
}

export type Actions =
    | {
          type: ActionType.SET_SEARCH_TEXT | ActionType.SET_FROM | ActionType.SET_TO
          payload: string
      }
    | {
          type: ActionType.SET_SORT
          payload: SortParams | ''
      }
    | {
          type: ActionType.SET_FILTERS
          payload: FilterParams[]
      }
    | {
          type: ActionType.SET_TIMELINE
          payload: TimelineParams
      }
    | {
          type: ActionType.RESET_FILTERS
          payload: Partial<DefaultFilters> | undefined
      }
