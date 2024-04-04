import {
    Button,
    Center,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Flex,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { RetrunsColumns, ShippingData } from 'page-modules/return/type/return'
import ShipmentDetail from 'page-modules/tracking/orders/components/ShipmentDetail'
import Loading from 'shared/components/Loading/Loading'

import styles from './MultipleTextCell.module.scss'

// type ColumnsData = ShippingData[]
type Props = {
    info: CellContext<RetrunsColumns, ShippingData[]>
}
const MultipleTextCell = ({ info: { getValue } }: Props) => {
    const { onOpen, isOpen, onClose } = useDisclosure()
    const data = getValue()
    const trackingData = data.find((obj) => obj.key === 'trackingNumber')
    const handleOnClick = (key: string) => {
        if (key === 'trackingNumber') onOpen()
    }
    return (
        <>
            <Flex gap={2} flexDir="column">
                {data.map((obj: any) => (
                    <Text key={obj.key} className={styles.overflowEllipsis} fontWeight="bold">
                        {obj.display}
                        {' : '}
                        <Text
                            className={`${obj.key === 'trackingNumber' && obj.value !== 'N/A' ? styles.link : ''}`}
                            fontWeight="normal"
                            as="span"
                            onClick={() => handleOnClick(obj.key)}
                        >
                            {obj.value}
                        </Text>
                    </Text>
                ))}
            </Flex>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
                <DrawerOverlay transform="none !important" />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2} px={4} bg={`gray.100`}>
                        Shipment Details
                    </DrawerHeader>

                    <DrawerBody>
                        {trackingData ? (
                            <ShipmentDetail trackingNumber={trackingData.value} />
                        ) : (
                            <Center h={'100%'}>
                                <Loading />
                            </Center>
                        )}
                    </DrawerBody>

                    <DrawerFooter
                        justifyContent="flex-start"
                        borderTop="1px solid var(--chakra-colors-gray-200)"
                        py={2}
                        px={4}
                        bg={`gray.100`}
                    >
                        <Flex justify="flex-start">
                            <Button bg={`white`} variant="outline" onClick={onClose} size="sm" h={`28px`}>
                                Close
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default MultipleTextCell
