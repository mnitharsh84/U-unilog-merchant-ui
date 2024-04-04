import { Popover, PopoverContent, PopoverTrigger } from '@chakra-ui/react'
import Image from 'next/image'
import { ReactNode, useState } from 'react'
import { MEDIA } from 'shared/utils/enums'

type Props = {
    mediaURL: string
    trigger: ReactNode
    mediaType?: MEDIA
}

function MediaPopover({ mediaURL, trigger, mediaType = MEDIA.IMAGE }: Props) {
    const [isOpen, setIsOpen] = useState(false)

    const openPopover = () => setIsOpen(true)
    const closePopover = () => setIsOpen(false)

    const styles = mediaType === MEDIA.IMAGE ? { width: '15rem', height: '15rem' } : { width: '25rem', height: '15rem' }

    return (
        <Popover isOpen={isOpen} onOpen={openPopover} onClose={closePopover}>
            <PopoverTrigger>{trigger}</PopoverTrigger>
            <PopoverContent p={0} boxShadow="md" zIndex={4} style={styles}>
                {mediaType === MEDIA.IMAGE ? (
                    <Image
                        loader={({ src }) => src}
                        src={mediaURL}
                        alt="User submitted image"
                        width="240"
                        height="240"
                        style={{ width: '15rem', height: '15rem', objectFit: 'cover' }}
                    />
                ) : (
                    <video controls={true} style={{ width: '100%', height: '100%' }}>
                        <source src={mediaURL}></source>
                    </video>
                )}
            </PopoverContent>
        </Popover>
    )
}

export default MediaPopover
