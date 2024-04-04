import ReturnsLayout from 'layouts/ReturnsLayout/ReturnsLayout'
import ReturnsList from 'page-modules/return/components/ReturnsList/ReturnsList'

export default function DeletedReturn() {
    return <ReturnsList tabStatus="DELETED" rmsType="RETURN"></ReturnsList>
}

DeletedReturn.layout = ReturnsLayout
