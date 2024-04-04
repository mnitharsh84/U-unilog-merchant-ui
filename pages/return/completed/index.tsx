import ReturnsLayout from 'layouts/ReturnsLayout/ReturnsLayout'
import ReturnsList from 'page-modules/return/components/ReturnsList/ReturnsList'

export default function Completed() {
    return <ReturnsList tabStatus="COMPLETED" rmsType="RETURN"></ReturnsList>
}

Completed.layout = ReturnsLayout
