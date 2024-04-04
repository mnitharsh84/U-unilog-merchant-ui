import { useMutation } from '@tanstack/react-query'
import { postAssociateUserToTeam, postCreateTeam, postCreateUser, putEditTeam, putUpdateUser } from 'apis/post'

export function UseMutationCreateTeam(url: string) {
    return useMutation({
        mutationKey: ['mutate-create-team'],
        mutationFn: (payload: any) => postCreateTeam(url, payload),
    })
}
export function UseMutationEditTeam(url: string) {
    return useMutation({
        mutationKey: ['mutate-edit-team'],
        mutationFn: (payload: any) => putEditTeam(url, payload),
    })
}
export function UseMutationCreateUser(url: string) {
    return useMutation({
        mutationKey: ['mutate-create-user'],
        mutationFn: (payload: any) => postCreateUser(url, payload),
    })
}

export function UseMutationEditUser(url: string) {
    return useMutation({
        mutationKey: ['mutate-edit-user'],
        mutationFn: (payload: any) => putUpdateUser(url, payload),
    })
}

export function UseMutationAssociateUserToTeam(url: string) {
    return useMutation({
        mutationKey: ['mutate-associate-user-to-team'],
        mutationFn: (payload: any) => postAssociateUserToTeam(url, payload),
    })
}
