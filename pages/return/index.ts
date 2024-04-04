import { useRouter } from 'next/router'
import { useEffect } from 'react'

const Return = () => {
    const router = useRouter()

    useEffect(() => {
        router.push('/return/requested')
    }, [])

    return null // This component doesn't render anything, it just redirects.
}

export default Return
