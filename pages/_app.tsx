import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { theme } from 'chakra-theme'
import { NextComponentType, NextPageContext } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import React, { FC, ReactNode, useEffect } from 'react'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { Toaster } from 'react-hot-toast'
import AuthGuard from 'shared/components/AuthGuard'
import AuthProvider from 'shared/providers/AuthProvider'

import MainLayout from '../layouts/MainLayout'
import '../styles/globals.css'

NProgress.configure({ showSpinner: false })
const queryClient = new QueryClient()

interface CustomAppProps extends AppProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Component: NextComponentType<NextPageContext, any, any> & { layout?: FC<{ children: ReactNode }> }
}

function MyApp({ Component, pageProps }: CustomAppProps) {
    const router = useRouter()

    useEffect(() => {
        const handleRouteStart = () => NProgress.start()
        const handleRouteDone = () => NProgress.done()

        router.events.on('routeChangeStart', handleRouteStart)
        router.events.on('routeChangeComplete', handleRouteDone)
        router.events.on('routeChangeError', handleRouteDone)

        return () => {
            // Make sure to remove the event handler on unmount!
            router.events.off('routeChangeStart', handleRouteStart)
            router.events.off('routeChangeComplete', handleRouteDone)
            router.events.off('routeChangeError', handleRouteDone)
        }
    }, [router.events])

    return (
        <ChakraProvider resetCSS={true} theme={theme}>
            <QueryClientProvider client={queryClient}>
                <Toaster
                    toastOptions={{
                        className: 'default-toast',
                    }}
                />
                {router.route === '/grant' ? (
                    <Component {...pageProps} />
                ) : (
                    <AuthProvider>
                        {router.route === '/404' || router.route === '/_error' ? (
                            <Component {...pageProps} />
                        ) : (
                            <MainLayout>
                                <AuthGuard>
                                    {Component.layout ? (
                                        <Component.layout>
                                            <Component {...pageProps} />
                                        </Component.layout>
                                    ) : (
                                        <Component {...pageProps} />
                                    )}
                                </AuthGuard>
                            </MainLayout>
                        )}
                    </AuthProvider>
                )}
            </QueryClientProvider>
        </ChakraProvider>
    )
}

export default MyApp
