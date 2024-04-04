import { useRouter } from 'next/router'
import AllEvents from 'page-modules/settings/components/AllEvents/AllEvents'
import PageCard from 'shared/components/PageCard/PageCard'

export default function Events() {
    const router = useRouter()
    // const { channelName } = router.query || {}; // Access the dynamic segment
    const channelName = Array.isArray(router.query?.channelName)
        ? router.query?.channelName[0]
        : router.query?.channelName
    const pageTitle = channelName ? String(channelName) : 'Communication Channel'
    const pageSubtitle = `Configure ${channelName} templates for various events.`
    let providerName = router.query?.pName ?? ''
    providerName = providerName ? String(providerName) : ''
    return (
        <PageCard title={pageTitle} subtitle={pageSubtitle} cardStyles={{ overflowY: 'auto' }}>
            <AllEvents providerName={providerName} channelCode={pageTitle}></AllEvents>
        </PageCard>
    )
}
