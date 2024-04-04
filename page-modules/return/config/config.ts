import { Field, FormExtraInfoType } from 'shared/types/form'
import { SearchFieldApiDetail } from 'shared/types/forms'
import { getField } from 'shared/utils/form'
import * as Yup from 'yup'

import { MasterRole } from '../type/return'

export const ApiUrl: { [key: string]: SearchFieldApiDetail } = {
    product_search_oms: {
        url: 'session/api/v1/rms/setup-policy/search-product',
        queryParams: [{ name: 'keyword' }],
    },
}

export const ReturnTabStatusMappingWithRoute = {
    ACTION_REQUIRED: 'requested',
    APPROVED: 'approved',
    CANCELLED: 'rejected',
    COMPLETED: 'completed',
    DELETED: 'deleted',
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
        displayName: 'Completed',
        bgColor: '#3498db',
    },
    DELETED: {
        displayName: 'Deleted',
        bgColor: '#FF0000',
    },
}

export const URL_MAPPING_WITH_TABSTATUS: { [key: string]: any } = {
    APPROVED: '/return/approved',
    ACTION_REQUIRED: '/return/requested/',
    CANCELLED: '/return/rejected',
    COMPLETED: '/return/completed',
}

export const MASTER_ROLE: MasterRole = {
    code: '',
    name: '',
    type: '',
}

export const rmsAccessMetadataApiurl = `session/api/v1/rms/user/access-metadata`

export const RETURN_ACTION: { [key: string]: any } = {
    approve: {
        title: 'approve',
        submitButtonlabel: 'Approve',
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
        note: `You've made several return requests for the same order. You can combine them all into a single request and process with just a click.`,
        isSubmitBtnDisabled: false,
    },
    manualApprove: {
        title: 'manual approve',
        submitButtonlabel: 'Manual Approve',
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
        isSubmitBtnDisabled: true,
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
        isSubmitBtnDisabled: false,
    },
    discard: {
        title: 'delete',
        submitButtonlabel: 'Move to Trash',
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
    completeRefund: {
        title: 'approve refund',
        submitButtonlabel: 'Approve Refund',
        showRemarkInput: false,
        isFormValid: true,
        isSubmitBtnDisabled: true,
    },
    backToRequested: {
        title: 'back to requested',
        submitButtonlabel: 'Back To Requested',
        showRemarkInput: false,
        isFormValid: true,
        isSubmitBtnDisabled: false,
    },
    convertToExchange: {
        title: 'Convert To Exchange',
        submitButtonlabel: 'Convert To Exchange',
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
        showRemarkInput: true,
        isFormValid: true,
    },
}

export enum ReturnActions {
    approve = 'approve',
    reject = 'reject',
    backToRequested = 'backToRequested',
    completeRefund = 'completeRefund',
    convertToExchange = 'convertToExchange',
    manualApprove = 'manualApprove',
}

export const SetUpFormFields: Field<any>[] = [
    getField<'text_input'>({
        fieldKey: 'return_window_in_days',
        type: 'text_input',
        placeholder: 'No of days',
        display: 'Number of days up to which customer can initiate return: ',
        init_value: '',
        hidden: false,
        arguments: {},
        validationSchema: Yup.number()
            .required('This field is required')
            .typeError('Please enter a valid number')
            .integer('Please enter a whole number')
            .min(0, 'Value must be greater than or equal to zero'),
        editable: true,
        required: true,
    }),
    getField<'select'>({
        fieldKey: 'rms_day_window_calculate',
        type: 'select',
        placeholder: 'Select Option',
        display: 'From which date does the return period begin?',
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
        display: 'Restrict return of order created between:',
        init_value: '',
        validationSchema: Yup.object(),
        arguments: {},
        hidden: false,
        editable: true,
        required: false,
    }),
    getField<'select'>({
        fieldKey: 'multiple_item_returns_enabled',
        type: 'select',
        placeholder: 'Select option',
        display: 'Allow customers to return multiple items at once?',
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
    getField<'select'>({
        fieldKey: 'return_fee_enabled',
        type: 'select',
        placeholder: 'Select option',
        display: 'Enable return fee?',
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
        fieldKey: 'return_fee',
        type: 'text_input',
        placeholder: 'Enter amount',
        display: 'Return fee',
        arguments: {},
        validationSchema: Yup.string(),
        hidden: false,
        init_value: '',
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
        info: 'Please note that any orders containing products with the specified catalog(s) will not be eligible for returns. If customers attempt to request a return for these items, they will be informed that they are non-returnable. However, items in the same order that do not have these tags will still be eligible for returns.',
    },
    return_window_in_days: {
        extraInfo: `You can choose 0 if you don't want customers to see the return button`,
        info: `Specify the maximum allowable return window for customers. For instance, if you establish a limit of 3 days, orders marked as delivered on April 20th, 2023, can be returned until April 23rd, 2023.`,
    },
    rms_restriction_period: {
        info: 'We are currently running a sale, and during this time, we will not be accepting any returns for products purchased.',
    },
    multiple_item_returns_enabled: {
        info: 'We offer the option for customers to return multiple items from a single order at once. Once this feature is enabled, customers can select multiple items and return them all in a single transaction.',
    },
    return_fee: {
        info: 'You can establish a return fee for customers, which will be automatically deducted from their refund amount.',
    },
}
export const SetupFormInitialValue = {
    rms_day_window_calculate: '',
    return_window_in_days: '',
    rms_restriction_period: '',
    multiple_item_returns_enabled: 'false',
    return_fee_enabled: 'false',
    return_fee: '',
    exclusive_catalogs: '',
}

export const ApproveManualFields = [
    getField<'text_input'>({
        fieldKey: 'trackingNumber',
        type: 'text_input',
        placeholder: 'Enter Tracking Number',
        display: 'Tracking Number',
        init_value: '',
        validationSchema: Yup.string(),
        arguments: {},
        hidden: false,
        editable: true,
        required: false,
    }),
    getField<'select'>({
        fieldKey: 'shippingProviderCode',
        type: 'select',
        placeholder: 'Select Shipping Provider',
        display: 'Shipping Provider',
        init_value: '',
        validationSchema: Yup.string(),
        arguments: { options: [] },
        hidden: false,
        editable: true,
        required: false,
    }),
    getField<'select'>({
        fieldKey: 'facilityCode',
        type: 'select',
        placeholder: 'Select Facility',
        display: 'Facility',
        init_value: '',
        validationSchema: Yup.string(),
        arguments: { options: [] },
        hidden: false,
        editable: true,
        required: false,
    }),
]
