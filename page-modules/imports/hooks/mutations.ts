import { useMutation } from '@tanstack/react-query'
import { createImport } from 'apis/import/post'

export function useMutateCreateImport() {
    return useMutation({
        mutationKey: ['create-import'],
        mutationFn: (formData: FormData) => createImport(formData),
    })
}
