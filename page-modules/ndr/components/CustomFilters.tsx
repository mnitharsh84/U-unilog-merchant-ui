import { Flex, Grid, Text } from '@chakra-ui/react'
import { NdrFilter } from 'apis/get'
import { Form, Formik } from 'formik'
import FieldWrapper from 'page-modules/tracking/orders/components/FieldWrapper'
import { Dispatch, SetStateAction } from 'react'
import { FieldValue } from 'shared/types/forms'
import { INIT_VALUE_MAP } from 'shared/utils/forms'

import { CustomFilters as CustomFiltersType } from '../types/filters'

type Props = {
    filters: NdrFilter[]
    customFilters: CustomFiltersType
    setCustomFilters: Dispatch<SetStateAction<CustomFiltersType>>
}

export default function CustomFilters({ filters, customFilters, setCustomFilters }: Props) {
    return (
        <Formik
            initialValues={Object.keys(customFilters).reduce<Record<string, FieldValue>>((prev, fieldKey) => {
                return {
                    ...prev,
                    [fieldKey]: customFilters[fieldKey].value,
                }
            }, {})}
            onSubmit={() => void 0}
            enableReinitialize={true}
        >
            <Form>
                <Grid templateColumns={'repeat(2, 1fr)'} columnGap={'1rem'}>
                    {filters.map((filter) => {
                        if (!filter.enable) return <></>

                        return (
                            <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} mb={4} key={filter.key}>
                                <Text as={'p'} fontSize={'x-small'} color={'gray.500'} textTransform={'capitalize'}>
                                    {filter.display}:
                                </Text>
                                <FieldWrapper
                                    fieldKey={filter.key}
                                    field={{
                                        display: filter.display,
                                        hidden: !filter.enable,
                                        type: filter.type,
                                        init_value: INIT_VALUE_MAP[filter.type],
                                        options: filter.option.map((opt) => ({
                                            key: opt.key,
                                            display: opt.display,
                                            hidden: !opt.enable,
                                        })),
                                    }}
                                    persistFilters={setCustomFilters}
                                />
                            </Flex>
                        )
                    })}
                </Grid>
            </Form>
        </Formik>
    )
}
