import { Box, Flex, Grid } from '@chakra-ui/react'
import { ProductDetail } from 'page-modules/return/type/return'
import React, { useState } from 'react'

import { Reason } from '../AllReasons/type/AllReasons'
import ConvertExchnageForm from '../ConvertExchnageForm/ConvertExchnageForm'
import ProductInfo from '../ProductDetail/ProductDetail'
import ProductImage from '../ProductImage/ProductImage'
import styles from './ProductInfoWrapper.module.scss'

type Props = {
    items: ProductDetail[]
    parentFieldKey: string
    reasons: Array<Reason>
}

const ProductInfoWrapper = ({ items }: Props) => {
    const [visibleItems, setVisibleItems] = useState(1)

    const handleShowMore = (visibleItem: number) => {
        setVisibleItems(visibleItem)
    }
    return (
        <Grid templateColumns="repeat(1, 1fr)" gap={4}>
            {items.slice(0, visibleItems).map((item, index) => (
                <Flex key={`product-info-wrapper-${index}`} flexDir="column">
                    <Flex gap="4">
                        <ProductImage skuImage={item.skuImage} name={item.name}></ProductImage>
                        <ProductInfo name={item.name} price={item.price} quantity={item.quantity}></ProductInfo>
                    </Flex>
                    {visibleItems === 1 && visibleItems < items.length ? (
                        <button className={styles.showMoreBtn} onClick={() => handleShowMore(items.length)}>
                            Show More
                        </button>
                    ) : index === visibleItems - 1 && items.length > 1 ? (
                        <button className={styles.showMoreBtn} onClick={() => handleShowMore(1)}>
                            Show Less
                        </button>
                    ) : null}
                </Flex>
            ))}
        </Grid>
    )
}

const ProductInfoContainer = ({ items, parentFieldKey, reasons }: Props) => {
    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={4} className={styles.grid}>
            <ProductInfoWrapper reasons={reasons} parentFieldKey={parentFieldKey} items={items} />

            <Box>
                <ConvertExchnageForm reasons={reasons} parentFieldKey={parentFieldKey}></ConvertExchnageForm>
            </Box>
        </Grid>
    )
}

export default ProductInfoContainer
