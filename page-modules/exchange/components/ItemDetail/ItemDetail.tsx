import { Box, Card, Divider, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import { TabStatusDisplayName } from 'page-modules/exchange/config/config'
import { Exchange } from 'page-modules/exchange/type/exchange'
import ImageDownloader from 'shared/components/ImageDownloader'
import MediaPopover from 'shared/components/MediaPopover/MediaPopover'
import { MEDIA } from 'shared/utils/enums'
import { formatDateToCustomString, getMediaType } from 'shared/utils/functions'

import styles from './ItemDetails.module.scss'

const DAYS = 'days'
const DAY = 'day'
type Params = {
    _return: Exchange
    parentTabStatus: string
}
const ItemDetail = ({ _return: { items }, parentTabStatus }: Params) => {
    const displayname = TabStatusDisplayName[parentTabStatus].displayName
    const bgColor = TabStatusDisplayName[parentTabStatus].bgColor

    return (
        <Card mt={4}>
            <Flex p={4} flexDir="column" gap="4">
                <Flex mb="4" justifyContent={'flex-start'}>
                    <Flex flexDir="row" flex="1" gap="4">
                        <div className={styles.outerCircle} style={{ background: bgColor }}>
                            <div className={styles.innerCircle}></div>
                        </div>
                        <Box>
                            <Text fontSize="sm" fontWeight="bold" mb={2}>
                                {displayname}
                            </Text>
                            <Text fontSize="sm">Fulfilled on {formatDateToCustomString(items[0].fullfilmentData)}</Text>
                        </Box>
                    </Flex>
                    <Flex flex="1" justifySelf="flex-end" justifyContent="flex-end">
                        <Text fontSize="sm" mt={4} mb={2}>
                            Requested {items[0].requestedDaysBefore}{' '}
                            {`${items[0].requestedDaysBefore > 1 ? DAYS : DAY}`} ago
                        </Text>
                    </Flex>
                </Flex>
                {items &&
                    items.map((item, index) => (
                        <Flex key={`ItemDetai${index}`} px={4} flexDir="column" gap="4">
                            <Flex flexDir={{ base: 'column', md: 'row' }} gap="4">
                                <Box className={styles.productImage}>
                                    <Box className={styles.badge} as="span">
                                        {item.quantity}
                                    </Box>

                                    {item.skuImage ? (
                                        <Box className={styles.imageContainer}>
                                            <Image
                                                loader={({ src }) => src}
                                                className={styles.imageCover}
                                                src={item.skuImage}
                                                alt={item.name}
                                                width="80"
                                                height="80"
                                            />
                                        </Box>
                                    ) : (
                                        <Flex flexDir="column" className={styles.noImageContainer}>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                className={styles.imageIcon}
                                            >
                                                <img src="https://ngqa1.ucdn.in/assets/md-image.svg" />
                                            </Box>
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="center"
                                                className={styles.noImageText}
                                            >
                                                <Text textStyle="textInput">No Image</Text>
                                            </Box>
                                        </Flex>
                                    )}
                                </Box>
                                <Box flex="1" flexDir="column" alignItems="start" justifyContent="center">
                                    <Text fontSize="sm">{item.name}</Text>
                                    <Box fontSize="sm">
                                        <Text as="span">SKU:</Text>
                                        <Text as="span">{item.skuCode}</Text>
                                    </Box>
                                </Box>

                                <Box flex="1" flexDir="column" alignItems="start" justifyContent="center">
                                    <Text fontSize="sm" fontWeight="bold" mb={2}>
                                        <Text as="span" color="blue.500">
                                            ₹{' '}
                                        </Text>
                                        {`${item.price} * ${item.quantity}`}
                                        <Text as="span" color="blue.500">
                                            {' '}
                                            = ₹{' '}
                                        </Text>
                                        {item.price * item.quantity}
                                    </Text>
                                    <Text fontSize="sm">{item.taxDescription}</Text>
                                </Box>
                                {parentTabStatus !== 'CANCELLED' && (
                                    <Box flex="1" flexDir="column" alignItems="start" justifyContent="center">
                                        <Text fontSize="sm" fontWeight="bold">
                                            Requested Quantity :{' '}
                                            <Text as="span" fontWeight="normal">
                                                {item.quantity}
                                            </Text>
                                        </Text>
                                        <Text fontSize="sm" fontWeight="bold">
                                            Approved Quantity :{' '}
                                            <Text as="span" fontWeight="normal">
                                                {item.seller_approved_quantity}
                                            </Text>
                                        </Text>
                                        {parentTabStatus === 'COMPLETED' && (
                                            <Text fontSize="sm" fontWeight="bold">
                                                Returned Quantity :{' '}
                                                <Text as="span" fontWeight="normal">
                                                    {item.approved_quantity}
                                                </Text>
                                            </Text>
                                        )}
                                    </Box>
                                )}
                                {item.mediaURLs.length ? (
                                    <Flex
                                        gap={2}
                                        alignItems="start"
                                        maxW={'14rem'}
                                        justifyContent="flex-start"
                                        flexWrap={'wrap'}
                                    >
                                        {item.mediaURLs.map((mediaURL, index) => (
                                            <Flex key={mediaURL} flexDir={'column'}>
                                                <MediaPopover
                                                    mediaURL={mediaURL}
                                                    key={`image${index}`}
                                                    mediaType={getMediaType(mediaURL)}
                                                    trigger={
                                                        <Box className={styles.imageCoverBox}>
                                                            {getMediaType(mediaURL) === MEDIA.VIDEO ? (
                                                                <video
                                                                    src={mediaURL}
                                                                    className={styles.imageCover}
                                                                ></video>
                                                            ) : (
                                                                <Image
                                                                    loader={({ src }) => src}
                                                                    className={styles.imageCover}
                                                                    src={mediaURL}
                                                                    alt="User submitted image"
                                                                    width="64"
                                                                    height="64"
                                                                />
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                                <ImageDownloader
                                                    attr={{
                                                        'aria-label': 'download',
                                                        'width': '4rem',
                                                        'height': '2rem',
                                                        'background': 'aliceblue',
                                                        'borderRadius': '0 0 6px 6px',
                                                    }}
                                                    url={mediaURL}
                                                />
                                            </Flex>
                                        ))}
                                    </Flex>
                                ) : null}
                            </Flex>
                            <Box fontSize="sm">
                                <Text fontWeight="bold" as="span">
                                    Reason:{' '}
                                </Text>
                                <Text as="span">{item.reasonText}</Text>
                            </Box>
                            {item.buyer_reason_text && (
                                <Box fontSize="sm">
                                    <Text fontWeight="bold" as="span">
                                        {`Buyer's comment:`}{' '}
                                    </Text>
                                    <Text as="span">{item.buyer_reason_text}</Text>
                                </Box>
                            )}
                            <Divider></Divider>
                        </Flex>
                    ))}
                <Flex flexDir="column" flex="1" gap="4" px={4}>
                    <Box fontSize="sm">
                        <Text fontWeight="bold" as="span">
                            Shipping Type:
                        </Text>
                        <Text ps={1} as="span">
                            {items[0].shippingOption}
                        </Text>
                    </Box>
                    {items[0].seller_remark && (
                        <Box fontSize="sm">
                            <Text fontWeight="bold" as="span">
                                Seller Remark:
                            </Text>
                            <Text ps={1} as="span">
                                {items[0].seller_remark}
                            </Text>
                        </Box>
                    )}
                </Flex>
            </Flex>
        </Card>
    )
}

export default ItemDetail
