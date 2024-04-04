import { Box, Flex, Text } from '@chakra-ui/react'
import Image from 'next/image'
import styles from 'shared/styles/image.module.scss'

type productImage = {
    skuImage: string
    name: string
}

const ProductImage = ({ skuImage, name }: productImage) => {
    return skuImage ? (
        <Box className={styles.imageContainer}>
            <Image
                loader={({ src }) => src}
                className={styles.imageCover}
                src={skuImage}
                alt={name}
                width="80"
                height="80"
            />
        </Box>
    ) : (
        <Flex flexDir="column" className={styles.noImageContainer}>
            <Box display="flex" alignItems="center" justifyContent="center" className={styles.imageIcon}>
                <img src="https://ngqa1.ucdn.in/assets/md-image.svg" />
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center" className={styles.noImageText}>
                <Text fontSize="xs" textStyle="textInput">
                    No Image
                </Text>
            </Box>
        </Flex>
    )
}

export default ProductImage
