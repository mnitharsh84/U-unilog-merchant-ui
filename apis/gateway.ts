import Cookies from 'js-cookie'
import Router from 'next/router'
import toast from 'react-hot-toast'

import DomainHandler, { Domain } from './domain-handler'

const domainResolver = new DomainHandler()
const defaultHeaders = new Headers()

defaultHeaders.append('APP-KEY', '#$%^SK&SNLSH*^%SF')
defaultHeaders.append('Content-Type', 'application/json')
defaultHeaders.append('accept', '*/*')
defaultHeaders.append('AUTH-TYPE', 'jwt_only')

export default async function gateway(
    URL: string,
    options: RequestInit,
    domain?: Domain,
    additionalHeaders?: { name: string; value: string }[],
) {
    if (!Cookies.get('JWT-TOKEN') && URL.indexOf('api/seller/auth_jwt') === -1) {
        if (URL !== 'api/system/meta') {
            toast.error(String('401: Unauthenticated User'))
        }
        Router.push(process.env.NEXT_PUBLIC_HOME_ROUTE ?? 'https://unilog.unicommerce.com')
        return
    } else {
        if (!defaultHeaders.has('JWT-TOKEN') && !defaultHeaders.has('jwt-token')) {
            defaultHeaders.append('JWT-TOKEN', Cookies.get('JWT-TOKEN')!)
            defaultHeaders.append('Authorization', `Bearer ${Cookies.get('JWT-TOKEN')!}`)
        }
    }

    if (URL == 'session/api/v1/imports/create') {
        defaultHeaders.delete('Content-Type')
    } else defaultHeaders.set('Content-Type', 'application/json')

    if (additionalHeaders) {
        additionalHeaders.forEach((header) => {
            if (defaultHeaders.has(header.name)) defaultHeaders.delete(header.name)
            defaultHeaders.append(header.name, header.value)
        })
    }

    const baseUrl = domainResolver.findDomain(domain)

    const res = await fetch(`${baseUrl}/${URL}`, {
        ...options,
        headers: defaultHeaders,
    })

    const text = await res.text()
    const json = text ? JSON.parse(text) : {}

    if (res.status !== 200) {
        if (res.status === 403) {
            if (!URL.includes('/rms/')) Cookies.remove('JWT-TOKEN')
        }
    }

    if (!res.ok) {
        toast.error(`${json['errorMessage'] || 'An unidentified error occurred. Please try again later'}`, {
            id: URL,
            position: 'top-right',
        })
        throw new Error(res.statusText)
    }

    return json
}

export async function initAuth(URL: string, options: RequestInit) {
    const res = await fetch(`${domainResolver.findDomain('SHIPPER_PANEL')}/${URL}`, {
        ...options,
        headers: defaultHeaders,
    })
    if (res.status !== 200) {
        toast.error(`${res.status} error for path /${URL}.`)
        return {}
    }
    if (!res.ok) throw new Error(res.statusText)
    const text = await res.text()
    return text ? JSON.parse(text) : {}
}
