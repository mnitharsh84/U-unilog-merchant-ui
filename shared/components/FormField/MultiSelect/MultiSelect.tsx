import { Checkbox, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { ChangeEvent, useMemo } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { Field, FieldOptions } from 'shared/types/forms'

import styles from './MultiSelect.module.scss'

type Props = {
    fieldKey: string
    field: Field<'multi_select'>
    changeValue?: (param: { value: string; field: Field<'multi_select'>; fieldKey: string }) => void
}

const useSelectAllStatus = (values: string[], options: FieldOptions[] | undefined) => {
    const areAllValuesSelected: boolean = useMemo(() => {
        if (!options) return false

        return values.length !== 0 && values.length == (options.length || 0)
    }, [values, options])

    return areAllValuesSelected
}

export default function MultiSelect({ field, fieldKey, changeValue }: Props) {
    const formik = useFormikContext()

    const values: string[] = formik.values?.[fieldKey as keyof typeof formik.values] || []

    const areAllValuesSelected = useSelectAllStatus(values, field?.options)

    const onCheckboxChange = (ev: ChangeEvent<HTMLInputElement>, key: string) => {
        if (ev.target.checked) formik.setFieldValue(fieldKey, [...values, key])
        else
            formik.setFieldValue(
                fieldKey,
                values.filter((value) => value !== key),
            )
        if (changeValue) {
            changeValue({ value: key, field, fieldKey })
        }
    }

    // Access the error for the nested field
    const nestedError = getIn(formik.errors, fieldKey)
    // Access the touched status for the nested field
    const nestedTouched = getIn(formik.touched, fieldKey)
    // Check if the field is touched to determine if it's invalid
    const isInvalid = nestedTouched && nestedError

    const selectAllOptions = () => {
        if (values.length !== field.options?.length) {
            const allValues = field.options?.map((option) => option.key) || []
            formik.setFieldValue(fieldKey, [...allValues])
        } else {
            formik.setFieldValue(fieldKey, [])
        }
    }
    return (
        <Menu autoSelect={false} closeOnSelect={false}>
            <MenuButton type="button" background="white" fontSize="small" w={'100%'}>
                <Flex
                    align="center"
                    justifyContent="space-between"
                    fontWeight="normal"
                    borderRadius={'0.3rem'}
                    className={`${isInvalid ? styles.menuInvalid : styles.filterByButton} ${
                        field.required ? styles.mandatory : ''
                    }`}
                >
                    {!!values ? `${values.length} Selected` : <Text as="span">Select options</Text>}
                    <AiFillCaretDown fontSize="14px" />
                </Flex>
            </MenuButton>
            <MenuList>
                {field.options?.filter((option) => !option.hidden)?.length ? (
                    <>
                        {field.showSelectAll && (
                            <MenuItem key="selectAll">
                                <Checkbox
                                    isChecked={areAllValuesSelected}
                                    className={styles.checkbox}
                                    onChange={selectAllOptions}
                                >
                                    Select All
                                </Checkbox>
                            </MenuItem>
                        )}
                        {field.options
                            .filter((option) => !option.hidden)
                            .map((option) => (
                                <MenuItem key={option.key}>
                                    <Checkbox
                                        isChecked={values.includes(option.key)}
                                        onChange={($event) => onCheckboxChange($event, option.key)}
                                        className={styles.checkbox}
                                    >
                                        {option.display}
                                    </Checkbox>
                                </MenuItem>
                            ))}
                    </>
                ) : (
                    <MenuItem isDisabled={true}>No Options Available</MenuItem>
                )}
            </MenuList>
        </Menu>
    )
}
