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
    HStack,
    Text,
    useDisclosure,
} from '@chakra-ui/react'
import { CellContext } from '@tanstack/react-table'
import { ReportsColumns } from 'page-modules/ndr/types/reports'
import ShipmentDetail from 'page-modules/tracking/orders/components/ShipmentDetail'
import Loading from 'shared/components/Loading/Loading'

import styles from './cell-styles.module.scss'

type Props = {
    info: CellContext<
        ReportsColumns,
        {
            id: string
            carrier: string
            url: string
        }
    >
}

export default function ShipmentDetails({ info: { getValue } }: Props) {
    const { onOpen, isOpen, onClose } = useDisclosure()

    return (
        <>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>AWB: </Text> */}
                <Text className={`${styles.value} ${styles.link}`} onClick={onOpen}>
                    {getValue().id}
                </Text>
            </HStack>
            <HStack justifyContent="space-between">
                {/* <Text className={styles.key}>Provider: </Text> */}
                <Text className={styles.value}>{getValue().carrier}</Text>
            </HStack>
            {/* <Text>{getValue().id}</Text>
            <Text>{getValue().carrier}</Text> */}

            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xl">
                <DrawerOverlay transform="none !important" />
                <DrawerContent transform="none !important">
                    <DrawerCloseButton />
                    <DrawerHeader py={2} px={4} bg={`gray.100`}>
                        Shipment Details
                    </DrawerHeader>

                    <DrawerBody>
                        {getValue().id ? (
                            <ShipmentDetail trackingNumber={getValue().id} />
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
