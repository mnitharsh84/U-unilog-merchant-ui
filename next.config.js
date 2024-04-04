/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
}

module.exports = {
    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard/overview',
                permanent: true,
            },
            {
                source: '/ndr',
                destination: '/ndr/actions-required',
                permanent: true,
            },
            {
                source: '/dashboard',
                destination: '/dashboard/overview',
                permanent: true,
            },
            {
                source: '/tracking',
                destination: '/tracking/orders',
                permanent: true,
            },
            {
                source: '/manifest',
                destination: '/manifest/warehouse/view',
                permanent: true,
            },
            {
                source: '/manifest/warehouse',
                destination: '/manifest/warehouse/view',
                permanent: true,
            },
        ]
    },
    ...nextConfig,
}
