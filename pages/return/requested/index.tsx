import ReturnsLayout from 'layouts/ReturnsLayout/ReturnsLayout'
import ReturnsList from 'page-modules/return/components/ReturnsList/ReturnsList'

export default function Requested() {
    return <ReturnsList tabStatus="ACTION_REQUIRED" rmsType="RETURN"></ReturnsList>
}

Requested.layout = ReturnsLayout
