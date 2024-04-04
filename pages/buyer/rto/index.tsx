import BuyerLayout from 'layouts/BuyerLayout/BuyerLayout'
import BuyerRequests from 'page-modules/buyer/components/BuyerRequests/BuyerRequests'

export default function ActionsRTO() {
    return (
        <>
            <BuyerRequests tabStatus="MARK_RTO" />
        </>
    )
}

ActionsRTO.layout = BuyerLayout
