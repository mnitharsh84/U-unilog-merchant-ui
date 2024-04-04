import ReturnsViewLayout from 'layouts/ReturnsLayout/ReturnViewLayout'
import { useRouter } from 'next/router'
import ReturnsDetailView from 'page-modules/return/components/ReturnDetailView/ReturnDetailView'
import { ReturnActions } from 'page-modules/return/config/config'
import { ReturnDetailTabStatus, toolbarButton } from 'page-modules/return/type/return'

const getToolbarButton: toolbarButton[] = []
const actionType: ReturnActions[] = []

export default function Details() {
    const router = useRouter()
    const viewType: ReturnDetailTabStatus = Array.isArray(router.query.viewType)
        ? (router.query.viewType[0] as ReturnDetailTabStatus)
        : (router.query.viewType as ReturnDetailTabStatus) || 'details'
    return (
        <ReturnsViewLayout toolbarButtons={getToolbarButton}>
            <ReturnsDetailView
                parentTabStatus="COMPLETED"
                actionType={actionType}
                tabStatus={viewType}
                rmsType="RETURN"
            ></ReturnsDetailView>
        </ReturnsViewLayout>
    )
}
