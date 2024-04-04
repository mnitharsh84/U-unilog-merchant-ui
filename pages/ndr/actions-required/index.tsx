import NDR from 'layouts/NDR/NDR'
import Reports from 'page-modules/ndr/components/Reports'

export default function ActionsRequired() {
    return (
        <>
            <Reports tabStatus="ACTION_REQUIRED" />
        </>
    )
}

ActionsRequired.layout = NDR
