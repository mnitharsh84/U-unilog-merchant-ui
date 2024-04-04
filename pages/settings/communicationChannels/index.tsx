import AllCommunicationChannelsList from 'page-modules/settings/components/AllCommunicationChannelsList/AllCommunicationChannelsList'
import PageCard from 'shared/components/PageCard/PageCard'

const pageTitle = 'Communication Channels'
const pageSubtitle = 'Access and Configure Notification via Communication Channels.'
export default function CommunicationChannels() {
    return (
        <PageCard title={pageTitle} subtitle={pageSubtitle} cardStyles={{ overflowY: 'auto' }}>
            <AllCommunicationChannelsList></AllCommunicationChannelsList>
        </PageCard>
    )
}
