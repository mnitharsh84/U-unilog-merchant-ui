import { useRouter } from 'next/router'
import ViewTemplateList from 'page-modules/settings/components/ViewTemplateList/ViewTemplateList'
import PageCard from 'shared/components/PageCard/PageCard'

export default function Events() {
    const router = useRouter()
    let channelName = router.query?.channelName ?? ''
    channelName = channelName ? String(channelName) : 'Communication Channel'
    const pageTitle = channelName
    const pageSubtitle = `Configure ${channelName} templates for various events.`

    let eventId = router.query?.eventId ?? ''
    eventId = eventId ? String(eventId) : ''
    return (
        <PageCard title={pageTitle} subtitle={pageSubtitle} cardStyles={{ overflowY: 'auto' }}>
            <ViewTemplateList eventId={eventId}></ViewTemplateList>
        </PageCard>
    )
}
