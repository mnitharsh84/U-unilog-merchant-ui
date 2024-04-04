export type DomainMapper = {
    MERCHANT_PANEL: string
    SHIPPER_PANEL: string
}

export type Domain = keyof DomainMapper

export default class DomainHandler {
    private domains: DomainMapper

    constructor() {
        this.domains = {
            MERCHANT_PANEL: process.env.NEXT_PUBLIC_MERCHANT_PANEL ?? 'https://api-unilog.unicommerce.com',
            SHIPPER_PANEL: process.env.NEXT_PUBLIC_SHIPPER_PANEL ?? 'https://unilog.unicommerce.com',
        }

        if (typeof window !== 'undefined') {
            const LOCAL_MERCHANT_PANEL = window.sessionStorage.getItem('MERCHANT_PANEL')
            if (LOCAL_MERCHANT_PANEL) this.domains.MERCHANT_PANEL = LOCAL_MERCHANT_PANEL

            const LOCAL_SHIPPER_PANEL = window.sessionStorage.getItem('SHIPPER_PANEL')
            if (LOCAL_SHIPPER_PANEL) this.domains.SHIPPER_PANEL = LOCAL_SHIPPER_PANEL
        }
    }

    public findDomain(domain: Domain | undefined) {
        if (!domain) return this.domains.MERCHANT_PANEL

        return this.domains[domain]
    }

    public encodeUriParams(value: string | string[] | number | boolean) {
        if (typeof value === 'number' || typeof value === 'boolean') return value
        else if (typeof value === 'string') return encodeURIComponent(value)
        else return value.join(',')
    }
}
