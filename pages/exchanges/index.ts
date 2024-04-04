import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Exchanges = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/exchanges/requested')
    }, [])

    return null // This component doesn't render anything, it just redirects.
}

export default Exchanges
