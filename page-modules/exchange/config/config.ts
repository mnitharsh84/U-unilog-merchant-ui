import { Field, FormExtraInfoType } from 'shared/types/form'
import { SearchFieldApiDetail } from 'shared/types/forms'
import { getField } from 'shared/utils/form'
import * as Yup from 'yup'

import { MasterRole } from '../type/exchange'

export const ApiUrl: { [key: string]: SearchFieldApiDetail } = {
    product_search_oms: {
        url: 'session/api/v1/rms/setup-policy/search-product',
        queryParams: [{ name: 'keyword' }],
    },
}

export const ExchangeTabStatusMappingWithRoute = {
    ACTION_REQUIRED: 'requested',
    APPROVED: 'approved',
    CANCELLED: 'rejected',
    COMPLETED: 'exchanged',
    DELETED: 'deleted',
}

export const MASTER_ROLE: MasterRole = {
    code: '',
    name: '',
    type: '',
}

export const rmsAccessMetadataApiurl = `session/api/v1/rms/user/access-metadata`

export const URL_MAPPING_WITH_TABSTATUS: { [key: string]: any } = {
    APPROVED: '/exchanges/approved',
    ACTION_REQUIRED: '/exchanges/requested/',
    CANCELLED: '/exchanges/rejected',
    COMPLETED: '/exchanges/exchanged',
}

export const EXCHANGE_ACTION: { [key: string]: any } = {
    approve: {
        title: 'approve',
        submitButtonlabel: 'Approve',
        showRemarkInput: true,
        formFields: [
            {
                key: 'reversePickUpAction',
                type: 'select',
                placeHolder: 'Select exchange type',
                display: '',
                initValue: '',
                options: [
                    {
                        key: 'RIER',
                        display: 'Replace immediately expect return',
                    },
                    {
                        key: 'WAR',
                        display: 'Wait for return and replace',
                    },
                ],
                validation: Yup.string().required('Exchange type is required'),
                editable: true,
                required: true,
            },
            {
                key: 'remark',
                type: 'text_input',
                placeHolder: 'Enter Any Remark',
                display: '',
                initValue: '',
                validation: Yup.string().max(255, 'Remark must be at most 255 characters'),
                editable: true,
                required: false,
            },
        ],
        initialValues: { remark: '', reversePickUpAction: '' },
        isFormValid: false,
    },
    reject: {
        title: 'reject',
        submitButtonlabel: 'Reject',
        showRemarkInput: true,
        formFields: [
            {
                key: 'remark',
                type: 'text_input',
                placeHolder: 'Enter Any Remark',
                display: '',
                initValue: '',
                validation: Yup.string().max(255, 'Remark must be at most 255 characters'),
                editable: true,
                required: false,
            },
        ],
        initialValues: { remark: '' },
        isFormValid: true,
    },
    backToRequested: {
        title: 'back to requested',
        submitButtonlabel: 'Back To Requested',
        showRemarkInput: false,
    },
}

export const TabStatusDisplayName: { [key: string]: any } = {
    ACTION_REQUIRED: {
        displayName: 'Requested',
        bgColor: '#3498db',
    },
    APPROVED: {
        displayName: 'Approved',
        bgColor: '#BBE5B3',
    },
    CANCELLED: {
        displayName: 'Rejected',
        bgColor: '#FDAC9A',
    },
    COMPLETED: {
        displayName: 'Exchanged',
        bgColor: '#3498db',
    },
    DELETED: {
        displayName: 'Deleted',
        bgColor: '#FF0000',
    },
}

export const SetupFormFields: Field<any>[] = [
    getField<'text_input'>({
        fieldKey: 'exchange_window_in_days',
        type: 'text_input',
        placeholder: 'No of days',
        display: 'Number of days up to which customer can initiate exchange: ',
        init_value: '',
        arguments: {},
        validationSchema: Yup.string().matches(/^\d+$/, 'Please enter a valid number'),
        editable: true,
        required: false,
        hidden: false,
    }),
    getField<'select'>({
        fieldKey: 'rms_day_window_calculate',
        type: 'select',
        placeholder: 'Select Option',
        display: 'From which date does the exchange period begin?',
        init_value: '',
        validationSchema: Yup.string().required('This field is required'),
        editable: true,
        required: true,
        hidden: false,
        arguments: {
            options: [
                {
                    key: 'DELIVERED_DATE',
                    display: 'Delivered Date',
                    hidden: false,
                },
                {
                    key: 'DISPATCHED_DATE',
                    display: 'Dispatched Date',
                    hidden: false,
                },
                {
                    key: 'ORDER_CREATED_DATE',
                    display: 'Order Created Date',
                    hidden: false,
                },
            ],
        },
    }),
    getField<'daterange'>({
        fieldKey: 'rms_restriction_period',
        type: 'daterange',
        placeholder: 'Start date to end date',
        display: 'Restrict exchange of order created between:',
        init_value: '',
        validationSchema: Yup.object(),
        arguments: {},
        hidden: false,
        editable: true,
        required: false,
    }),

    getField<'select'>({
        fieldKey: 'multiple_item_exchanges_enabled',
        type: 'select',
        placeholder: 'Select to allow multiple exchange',
        display: 'Allow customers to exchange multiple items at once?',
        init_value: 'false',
        validationSchema: Yup.string(),
        arguments: {
            options: [
                {
                    key: 'true',
                    display: 'Yes',
                    hidden: false,
                },
                {
                    key: 'false',
                    display: 'No',
                    hidden: false,
                },
            ],
        },
        hidden: false,
        editable: true,
        required: false,
    }),
    // {
    //     key: 'out_of_stock_exchange_enabled',
    //     type: 'select',
    //     placeHolder: "Select to Allow exchange for out of stock products",
    //     display: 'Allow customers to place exchange requests even if product is out of stock on Shopify',
    //     initValue: '',
    //     options: [{
    //         key: 'yes',
    //         display: 'Yes'
    //     },
    //     {
    //         key: 'no',
    //         display: 'No'
    //     }],
    //     validation: validationSchema,
    //     editable: true,
    //     required: false,
    //     info: 'Configure the exchange settings in a way which is convenient for both customers and business.'
    // },
    // {
    //     key: 'exchange_with_other_product_enabled',
    //     type: 'select',
    //     placeHolder: "Select to Allow exchange with other products",
    //     display: 'Let customers exchange with any other product',
    //     initValue: '',
    //     options: [{
    //         key: 'yes',
    //         display: 'Yes'
    //     },
    //     {
    //         key: 'no',
    //         display: 'No'
    //     }],
    //     validation: validationSchema,
    //     editable: true,
    //     required: false
    // },
    getField<'select'>({
        fieldKey: 'exchange_fee_enabled',
        type: 'select',
        display: 'Enable exchange fee?',
        placeholder: 'Select option',
        init_value: 'false',
        validationSchema: Yup.string(),
        arguments: {
            options: [
                {
                    key: 'true',
                    display: 'Yes',
                    hidden: false,
                },
                {
                    key: 'false',
                    display: 'No',
                    hidden: false,
                },
            ],
        },
        hidden: false,
        editable: true,
        required: false,
    }),
    getField<'text_input'>({
        fieldKey: 'exchange_fee',
        type: 'text_input',
        placeholder: 'Enter amount',
        display: 'Exchange fee',
        init_value: '',
        arguments: {},
        hidden: false,
        validationSchema: Yup.string().matches(/^\d+$/, 'Please enter a valid number'),
        editable: true,
        required: false,
    }),
    getField<'multi_text_input'>({
        fieldKey: 'exclusive_catalogs',
        type: 'multi_text_input',
        placeholder: 'Enter comma separated products',
        display: 'Restrict return of products:',
        init_value: '',
        validationSchema: Yup.string(),
        arguments: {},
        hidden: false,
        editable: true,
        required: false,
    }),
]

export const FieldExtraInfo: { [key: string]: FormExtraInfoType } = {
    exclusive_catalogs: {
        info: 'Please note that any orders containing products with the specified catalog(s) will not be eligible for exchanges. If customers attempt to request a exchange for these items, they will be informed that they are non-returnable. However, items in the same order that do not have these tags will still be eligible for exchanges.',
    },
    exchange_window_in_days: {
        extraInfo: `You can set it to 0 if you do not want to see exchange buttom`,
        info: `Specify the maximum allowable exchange window for customers. For instance, if you establish a limit of 3 days, orders marked as delivered on April 20th, 2023, can be returned until April 23rd, 2023.`,
    },
    rms_restriction_period: {
        info: 'We are currently running a sale, and during this time, we will not be accepting any exchange for products purchased.',
    },
    multiple_item_exchanges_enabled: {
        info: 'We offer the option for customers to exchange multiple items from a single order at once. Once this feature is enabled, customers can select multiple items and exchange them all in a single transaction.',
    },
}

export const SetupFormInitialValue = {
    rms_day_window_calculate: '',
    exchange_window_in_days: '',
    rms_restriction_period: '',
    multiple_item_exchanges_enabled: 'false',
    exchange_fee_enabled: 'false',
    exchange_fee: '',
    exclusive_catalogs: '',
}
