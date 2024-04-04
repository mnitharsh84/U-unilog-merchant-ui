import { Button, CardBody, Center, Flex } from '@chakra-ui/react'
import { FormikProps } from 'formik'
import { useRouter } from 'next/router'
import SLAConfigurationCard from 'page-modules/manifest/warehouse/components/SLAConfigurationCard'
import ServiceabilityCard from 'page-modules/manifest/warehouse/components/ServiceabilityCard'
import WarehouseCard from 'page-modules/manifest/warehouse/components/WarehouseCard'
import { useMutateUpdateWarehouse } from 'page-modules/manifest/warehouse/hooks/mutations'
import { useWarehouse } from 'page-modules/manifest/warehouse/hooks/queries'
import { WarehouseData } from 'page-modules/manifest/warehouse/types/warehouse'
import { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'
import PageCard from 'shared/components/PageCard/PageCard'

export default function EditWarehouse() {
    const {
        query: { code },
    } = useRouter()

    const mutation = useMutateUpdateWarehouse()
    const router = useRouter()

    const addWarehouseFormRef = useRef<FormikProps<Record<string, unknown>>>(null)
    const slaConfigurationFormRef = useRef<FormikProps<Record<string, unknown>>>(null)
    const serviceabilityFormRef = useRef<FormikProps<Record<string, unknown>>>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { isLoading: isApiLoading, isError, data } = useWarehouse(String(code))

    if (isApiLoading)
        return (
            <Center h={`200px`}>
                <Loading />
            </Center>
        )
    if (isError)
        return (
            <Center h={`200px`}>
                <ErrorPlaceholder message="Failed to load warehouse data. Please try again later." />
            </Center>
        )

    const updateWarehouse = () => {
        if (
            !addWarehouseFormRef.current?.isValid ||
            !slaConfigurationFormRef.current?.isValid ||
            !serviceabilityFormRef.current?.isValid
        ) {
            addWarehouseFormRef.current?.submitForm()
            slaConfigurationFormRef.current?.submitForm()
            serviceabilityFormRef.current?.submitForm()
            toast.error('Please fill correct values!')
            return
        }

        const payload = {
            ...addWarehouseFormRef.current?.values,
            ...slaConfigurationFormRef.current?.values,
            ...serviceabilityFormRef.current?.values,
        }

        if (payload['enabled'] === 'YES') payload['enabled'] = true
        else payload['enabled'] = false

        if (payload['areAllSkusFulfillable'] === 'YES') payload['areAllSkusFulfillable'] = true
        else payload['areAllSkusFulfillable'] = false

        setIsLoading(true)
        mutation.mutate(payload as WarehouseData, {
            onSuccess: () => {
                toast.success(`Successfully edited ${payload['name']}`)
                router.push('/manifest/warehouse/view')
            },
            onSettled: () => setIsLoading(false),
        })
    }

    return (
        <PageCard title={data.name} subtitle="Edit details">
            <CardBody h={'100%'} overflow={'auto'}>
                <WarehouseCard ref={addWarehouseFormRef} warehouseData={data} />
                <SLAConfigurationCard ref={slaConfigurationFormRef} warehouseData={data} />
                <ServiceabilityCard ref={serviceabilityFormRef} warehouseData={data} />
                <Flex justifyContent={'flex-end'}>
                    <Button colorScheme={'teal'} onClick={updateWarehouse} fontSize={'sm'} isLoading={isLoading}>
                        Update
                    </Button>
                </Flex>
            </CardBody>
        </PageCard>
    )
}
