import { Button, CardBody, Flex } from '@chakra-ui/react'
import { FormikProps } from 'formik'
import { useRouter } from 'next/router'
import SLAConfigurationCard from 'page-modules/manifest/warehouse/components/SLAConfigurationCard'
import ServiceabilityCard from 'page-modules/manifest/warehouse/components/ServiceabilityCard'
import WarehouseCard from 'page-modules/manifest/warehouse/components/WarehouseCard'
import { useMutateCreateWarehouse } from 'page-modules/manifest/warehouse/hooks/mutations'
import { WarehouseData } from 'page-modules/manifest/warehouse/types/warehouse'
import { useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import PageCard from 'shared/components/PageCard/PageCard'

export default function AddWarehouse() {
    const addWarehouseFormRef = useRef<FormikProps<Record<string, unknown>>>(null)
    const slaConfigurationFormRef = useRef<FormikProps<Record<string, unknown>>>(null)
    const serviceabilityFormRef = useRef<FormikProps<Record<string, unknown>>>(null)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const router = useRouter()
    const createWarehouseMutation = useMutateCreateWarehouse()

    const addWarehouse = () => {
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
        createWarehouseMutation.mutate(payload as WarehouseData, {
            onSuccess: () => {
                toast.success(`Successfully created ${payload['name']}`)
                router.push('/manifest/warehouse/view')
            },
            onSettled: () => setIsLoading(false),
        })
    }

    return (
        <PageCard title="Add Warehouse" subtitle="Enter relevant details to create a new warehouse">
            <CardBody h={'100%'} overflow={'auto'}>
                <WarehouseCard ref={addWarehouseFormRef} />
                <SLAConfigurationCard ref={slaConfigurationFormRef} />
                <ServiceabilityCard ref={serviceabilityFormRef} />
                <Flex justifyContent={'flex-end'}>
                    <Button colorScheme={'teal'} onClick={addWarehouse} fontSize={'sm'} isLoading={isLoading}>
                        Submit
                    </Button>
                </Flex>
            </CardBody>
        </PageCard>
    )
}
