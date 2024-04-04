import ReturnsLayout from 'layouts/ReturnsLayout/ReturnsLayout'
import ReturnsList from 'page-modules/return/components/ReturnsList/ReturnsList'

export default function Rejected() {
    return <ReturnsList tabStatus="CANCELLED" rmsType="RETURN"></ReturnsList>
}

Rejected.layout = ReturnsLayout
