import { Icon } from '@chakra-ui/react'
import { CgSpinner } from 'react-icons/cg'

import styles from './loading.module.scss'

export default function Loading() {
    return <Icon as={CgSpinner} fontSize="32px" fontWeight="normal" className={styles.loadingSpinner} />
}
