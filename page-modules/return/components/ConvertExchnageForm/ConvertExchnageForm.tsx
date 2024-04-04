import { Flex, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { ConvertToExchangeFormValues } from 'page-modules/return/type/return'
import FormField from 'shared/components/FormField/FormField'

import { Reason } from '../AllReasons/type/AllReasons'

type Props = {
    reasons: Array<Reason>
    parentFieldKey: string
}

const ConvertExchnageForm = ({ reasons, parentFieldKey }: Props) => {
    const formik = useFormikContext<ConvertToExchangeFormValues>()
    const isSubReason = (reasons: Array<Reason>, selectedReasonId: string) => {
        const reason = reasons.find((reason) => reason.id === selectedReasonId)
        return reason && reason.sub_reasons && reason.sub_reasons.length
    }
    const handleReasonChange = () => {
        formik.setFieldValue(`${parentFieldKey}.exchangeSubReasonId`, '')
    }

    return (
        <Flex gap={4} flexDir="column">
            <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} mb={4} flex={1}>
                <Text
                    fontWeight="bold"
                    as={'span'}
                    fontSize={'xs'}
                    textTransform={'capitalize'}
                    ps={3}
                    pb={3}
                    className="required-field"
                >
                    Select Reason
                </Text>
                <FormField
                    fieldKey={`${parentFieldKey}.exchangeReasonId`}
                    field={{
                        display: 'Reason',
                        type: 'select',
                        init_value: '',
                        options: reasons.map((reason) => ({
                            display: reason.text,
                            value: reason.id,
                            key: reason.id,
                            hidden: false,
                        })),
                        hidden: false,
                        required: true,
                        editable: true,
                    }}
                    changeValue={handleReasonChange}
                />
            </Flex>

            {isSubReason(reasons, formik.values[parentFieldKey].exchangeReasonId) ? (
                <Flex gap={1} flexDir={'column'} alignItems={'flex-start'} mb={4} flex={1}>
                    <Text as={'span'} fontSize={'xs'} textTransform={'capitalize'} ps={3} pb={3} fontWeight="bold">
                        Select Sub Reason
                    </Text>
                    <FormField<'select'>
                        fieldKey={`${parentFieldKey}.exchangeSubReasonId`}
                        field={{
                            display: 'Sub Reason',
                            type: 'select',
                            init_value: '',
                            options: reasons
                                .find((reason) => reason.id === formik.values[parentFieldKey].exchangeReasonId)
                                ?.sub_reasons.map((reason: any) => ({
                                    display: reason.text,
                                    value: reason.id,
                                    key: reason.id,
                                    hidden: false,
                                })),
                            hidden: false,
                            required: true,
                            editable: true,
                        }}
                    />
                </Flex>
            ) : null}
        </Flex>
    )
}

export default ConvertExchnageForm
