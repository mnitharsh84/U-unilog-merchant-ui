import ExchangeLayout from 'layouts/ExchangeLayout/ExchangeLayout'
import ExchangeList from 'page-modules/exchange/components/ExchangeList/ExchangeList'

export default function Deleted() {
    return <ExchangeList tabStatus="DELETED" rmsType="EXCHANGE"></ExchangeList>
}

Deleted.layout = ExchangeLayout
