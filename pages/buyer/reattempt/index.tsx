import BuyerLayout from 'layouts/BuyerLayout/BuyerLayout'
import BuyerRequests from 'page-modules/buyer/components/BuyerRequests/BuyerRequests'

export default function ActionsReattempt() {
    return (
        <>
            <BuyerRequests tabStatus="REATTEMPT" />
        </>
    )
}

ActionsReattempt.layout = BuyerLayout
