import ExchangeLayout from 'layouts/ExchangeLayout/ExchangeLayout'
import ExchangeList from 'page-modules/exchange/components/ExchangeList/ExchangeList'

export default function Requested() {
    return <ExchangeList tabStatus="CANCELLED" rmsType="EXCHANGE"></ExchangeList>
}

Requested.layout = ExchangeLayout
