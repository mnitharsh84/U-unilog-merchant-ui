import { NextRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { formatText } from './text-format'

export function useBreadcrumbs(router: NextRouter) {
    const [breadcrumbs, setBreadcrumbs] = useState<{ href: string; title: string }[]>([])

    useEffect(() => {
        const generateBreadcrumbs = () => {
            const asPathWithoutQuery = router.asPath.split('?')[0]
            const asPathNestedRoutes = asPathWithoutQuery.split('/').filter((v) => v.length > 0)
            const crumblist = asPathNestedRoutes.map((subpath, idx) => {
                const href = '/' + asPathNestedRoutes.slice(0, idx + 1).join('/')

                // 'AbcDef' to 'Abc Def' to ['Abc', 'Def']
                const crumbs = (subpath.charAt(0) + subpath.slice(1).replace(/([A-Z])/g, ' $1')).split(' ')
                const title = crumbs.map(formatText).join(' ')

                return { href, title }
            })

            return [...crumblist]
        }

        setBreadcrumbs(generateBreadcrumbs())
    }, [router.asPath])

    return breadcrumbs
}
