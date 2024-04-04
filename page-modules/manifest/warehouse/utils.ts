import { STATE_CODE_MAP } from 'page-modules/dashboard/overview/utils'

export const CUT_OFF_TIME_OPTIONS = [
    { display: '9 AM', key: '09:00', hidden: false },
    { display: '10 AM', key: '10:00', hidden: false },
    { display: '11 AM', key: '11:00', hidden: false },
    { display: '12 PM', key: '12:00', hidden: false },
    { display: '1 PM', key: '13:00', hidden: false },
    { display: '2 PM', key: '14:00', hidden: false },
    { display: '3 PM', key: '15:00', hidden: false },
    { display: '4 PM', key: '16:00', hidden: false },
    { display: '5 PM', key: '17:00', hidden: false },
    { display: '6 PM', key: '18:00', hidden: false },
]

export const STATE_CODE_OPTIONS = Object.keys(STATE_CODE_MAP).map((key) => ({
    display: STATE_CODE_MAP[key as keyof typeof STATE_CODE_MAP],
    key,
    hidden: false,
}))
