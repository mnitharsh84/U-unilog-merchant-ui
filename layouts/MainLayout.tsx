import { Flex } from '@chakra-ui/layout'
import { Box } from '@chakra-ui/react'
import { ReactNode } from 'react'

import NavBar from './NavBar/Navbar'
import Sidebar from './Sidebar/Sidebar'
import styles from './mainLayout.module.scss'

export default function MainLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Sidebar />
            <Flex className={styles.layout} flexDir="column">
                <NavBar />
                <Flex className={styles.contentArea} flexGrow={1} p={'1rem'}>
                    <Box w={'100%'} h={'100%'}>
                        {children}
                    </Box>
                </Flex>
            </Flex>
        </>
    )
}
