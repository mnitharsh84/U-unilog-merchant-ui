enum CAPITALISE_ALL {
    ndr,
    rto,
}

enum CAPITALISE_NONE {}

const UNIQUE = {
    'actions-requested': 'Actions Requested',
    'actions-required': 'Actions Required',
    'courier-sla': 'Courier SLA',
    'edd-calculator': 'EDD Calculator',
}

export function formatText(text: string): string {
    if (text in CAPITALISE_ALL) text = text.toUpperCase()
    else if (text in CAPITALISE_NONE) text = text.toLowerCase()
    else if (text in UNIQUE) text = UNIQUE[text as keyof typeof UNIQUE]
    else text = text.charAt(0).toUpperCase() + text.slice(1)

    return text
}
