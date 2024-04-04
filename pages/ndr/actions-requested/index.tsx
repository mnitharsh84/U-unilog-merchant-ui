import NDR from 'layouts/NDR/NDR'
import Reports from 'page-modules/ndr/components/Reports'

export default function ActionsRequested() {
    return (
        <>
            <Reports tabStatus="ACTION_TAKEN" />
        </>
    )
}

ActionsRequested.layout = NDR
