import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import Image from 'next/image'
import { ExchangeColumns } from 'page-modules/exchange/type/exchange'
import { useState } from 'react'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'
import { ProductColumnItem } from 'shared/types/table'

import style from './ProductImage.module.scss'

type Props = {
    info: CellContext<ExchangeColumns, ProductColumnItem[]>
}

const ProductImage = ({ info: { getValue } }: Props) => {
    const displayCount = 1
    const requestItems = getValue()
    const [showAll, setShowAll] = useState(false)
    const itemsToShow = showAll ? requestItems : requestItems.slice(0, displayCount)

    return (
        <>
            {itemsToShow.length > 0
                ? itemsToShow.map((requestItem, index) => (
                      <Flex key={index} className={style.product} align="center" gap={4} mt={index > 0 ? 2 : 0}>
                          <Box className={style.productImage}>
                              <Box className={style.badge} as="span">
                                  {requestItem.quantity}
                              </Box>

                              {requestItem.sku_image ? (
                                  <Box className={style.imageContainer}>
                                      <Image
                                          loader={({ src }) => src}
                                          src={requestItem.sku_image}
                                          alt="Image Alt Text"
                                          width="64"
                                          height="64"
                                      />
                                  </Box>
                              ) : (
                                  <Flex flexDir="column" className={style.noImageContainer}>
                                      <Box
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          className={style.imageIcon}
                                      >
                                          <img src="https://ngqa1.ucdn.in/assets/md-image.svg" />
                                      </Box>
                                      <Box
                                          display="flex"
                                          alignItems="center"
                                          justifyContent="center"
                                          className={style.noImageText}
                                      >
                                          <Text textStyle="textInput">No Image</Text>
                                      </Box>
                                  </Flex>
                              )}
                          </Box>
                          <Box className={style.productName}>
                              <TextWithTooltip text={requestItem.product_display_name} width={'100%'}></TextWithTooltip>
                          </Box>
                      </Flex>
                  ))
                : null}
            {requestItems.length > displayCount && (
                <Button
                    mt="2"
                    onClick={() => setShowAll(!showAll)}
                    variant="link"
                    size="xs"
                    color="blue.400"
                    fontWeight="400"
                >
                    {showAll ? 'Show Less Items' : 'Show More Items'}
                </Button>
            )}
        </>
    )
}

export default ProductImage
