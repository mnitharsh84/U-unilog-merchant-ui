import { CloseIcon } from '@chakra-ui/icons'
import { Divider, Icon, Tag, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

import styles from './CustomTag.module.scss'

type Props = {
    title: string
    children: ReactNode
}

export default function CustomTag({ title, children }: Props) {
    return (
        <Tag fontWeight="normal" fontSize="xs" minWidth={'auto'} borderRadius={4} className={styles.filterTag}>
            <Text
                h={`1.5rem`}
                lineHeight={`1.5rem`}
                minW={'max-content'}
                fontSize="xs"
                fontWeight="bold"
                textTransform="uppercase"
                verticalAlign={`middle`}
            >
                {title}
            </Text>
            <Divider orientation="vertical" ml={1} borderColor="gray.300" h={`1.5rem`} />
            {children}
            <Icon as={CloseIcon} boxSize="0" color="gray.500" className={styles.removeFilterIcon} />
        </Tag>
    )
}
