import { ExternalLinkIcon } from '@chakra-ui/icons'
import { IconButton, IconButtonProps } from '@chakra-ui/react'
import { toast } from 'react-hot-toast'

type Props = {
    url: string
    attr: IconButtonProps
}
export default function ImageDownloader({ url, attr }: Props) {
    const previewImage = () => {
        if (!url) {
            toast.error('Invalid Image')
            return
        }
        window.open(url, '_blank', 'noreferrer')
    }

    if (!url) return <></>

    return <IconButton {...attr} icon={<ExternalLinkIcon />} onClick={previewImage} />
}
