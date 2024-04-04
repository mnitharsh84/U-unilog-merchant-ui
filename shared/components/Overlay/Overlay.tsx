import { Box, Flex, Spinner } from '@chakra-ui/react'

import styles from './Overlay.module.scss'

export function Overlay() {
    return (
        <Box className={styles.overlay}>
            <Flex
                h="100vh"
                w="100vw"
                alignItems="center"
                justifyContent="center"
                flexDir="column"
                className={styles.overlayContent}
            >
                <Box>
                    <Spinner thickness="2px" speed="0.65s" emptyColor="primary.50" color="primary.500" size="md" />
                </Box>
            </Flex>
        </Box>
    )
}

export default Overlay
