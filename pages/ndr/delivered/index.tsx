import NDR from 'layouts/NDR/NDR'
import Reports from 'page-modules/ndr/components/Reports'

export default function Delivered() {
    return (
        <>
            <Reports tabStatus="DELIVERED" />
        </>
    )
}

Delivered.layout = NDR
