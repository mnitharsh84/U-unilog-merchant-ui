import {
    Box,
    Divider,
    HStack,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
} from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ORDER_DETAILS, ReportsColumns } from 'page-modules/ndr/types/reports'
import { Fragment } from 'react'
import TextWithTooltip from 'shared/components/TextWithTooltip/TextWithTooltip'

import styles from './cell-styles.module.scss'

type Props = {
    info: CellContext<ReportsColumns, ORDER_DETAILS>
}

export default function OrderDetails({ info: { getValue } }: Props) {
    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>ID: </Text> */}
                <Text className={styles.value}>{getValue().id}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Amount: </Text> */}
                <Text className={styles.value}>₹{getValue().amount}</Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Payment: </Text> */}
                <Text className={styles.value}>{getValue().paymentMethod}</Text>
            </HStack>
            <Popover>
                <PopoverTrigger>
                    <Text
                        _hover={{ textDecoration: 'underline' }}
                        color={'blue.400'}
                        cursor={'pointer'}
                        className={styles.value}
                        fontSize={'xs'}
                    >
                        View Products
                    </Text>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>
                        <Text fontWeight={'bold'}>Products</Text>
                    </PopoverHeader>
                    <PopoverBody maxH={`200px`} overflow="auto">
                        {getValue().products.map((product, index) => {
                            return (
                                <Fragment key={index}>
                                    <Box>
                                        <HStack justifyContent="space-between">
                                            <Text className={styles.key}>Name: </Text>
                                            <TextWithTooltip text={product.name} maxWidth={'13rem'} />
                                        </HStack>
                                        <HStack justifyContent="space-between">
                                            <Text className={styles.key}>SKU: </Text>
                                            <TextWithTooltip text={product.sku} maxWidth={'13rem'} />
                                        </HStack>
                                        <HStack justifyContent="space-between">
                                            <Text className={styles.key}>Price: </Text>
                                            <TextWithTooltip text={product.price} maxWidth={'13rem'} />
                                        </HStack>
                                        {/* <TextWithTooltip text={`Name: ` + product.name} maxWidth={'13rem'} /> */}
                                        {/* <TextWithTooltip text={`SKU: ` + product.sku} maxWidth={'13rem'} /> */}
                                        {/* <TextWithTooltip text={`Price: ` + product.price} maxWidth={'13rem'} /> */}
                                    </Box>
                                    {index !== getValue().products.length - 1 ? <Divider my={2} /> : <></>}
                                </Fragment>
                            )
                        })}
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </>
    )
}
