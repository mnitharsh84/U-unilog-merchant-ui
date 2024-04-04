import ReturnsLayout from 'layouts/ReturnsLayout/ReturnsLayout'
import ReturnsList from 'page-modules/return/components/ReturnsList/ReturnsList'

export default function Approved() {
    return <ReturnsList tabStatus="APPROVED" rmsType="RETURN"></ReturnsList>
}

Approved.layout = ReturnsLayout
