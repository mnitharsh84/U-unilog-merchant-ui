import { useMutation } from '@tanstack/react-query'
import { initReportJobExecution } from 'apis/post'

// export type DownloadReportPayloadType = {
//     code: string | null | undefined
//     tenant_code: string | null | undefined
// }

export type payloadFilter = {
    id?: string
    text?: string | any
    selected_values?: Array<string> | any
    checked?: boolean | any
    start?: string | any
    end?: string | any
}
export type exportJobPayload = {
    name: string | null
    columns: string[]
    filters?: payloadFilter[]
}

export function useMutateReportDownloader() {
    return useMutation({
        mutationKey: ['mutate-download-report'],
        mutationFn: (payload: exportJobPayload) => initReportJobExecution(payload),
    })
}
