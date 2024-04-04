import { Checkbox, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { getIn, useFormikContext } from 'formik'
import { ChangeEvent, useMemo } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { Field, SelectOption } from 'shared/types/form'

import styles from './MultiSelect.module.scss'

const useSelectAllStatus = (values: string[], options: SelectOption[] | undefined) => {
    const areAllValuesSelected: boolean = useMemo(() => {
        if (!options) return false

        return values.length !== 0 && values.length == (options.length || 0)
    }, [values, options])

    return areAllValuesSelected
}

export default function MultiSelect({ field }: { field: Field<'multi_select'> }) {
    const formik = useFormikContext()

    const values: string[] = formik.values?.[field.fieldKey as keyof typeof formik.values] || []

    const areAllValuesSelected = useSelectAllStatus(values, field.arguments.options)

    const error = getIn(formik.errors, field.fieldKey)
    const isTouched = getIn(formik.touched, field.fieldKey)
    const isInvalid = !!error && !!isTouched

    const options = field.arguments.options.filter((option) => !option.hidden)

    const onCheckboxChange = (ev: ChangeEvent<HTMLInputElement>, key: string) => {
        if (ev.target.checked) formik.setFieldValue(field.fieldKey, [...values, key])
        else
            formik.setFieldValue(
                field.fieldKey,
                values.filter((value) => value !== key),
            )
        if (field.onValueChange) field.onValueChange(ev, formik)
    }

    const selectAllOptions = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.checked) {
            const allValues = options.map((option) => option.key) || []
            formik.setFieldValue(field.fieldKey, [...allValues])
        } else {
            formik.setFieldValue(field.fieldKey, [])
        }
    }

    // TODO: Show error message, Add label
    return (
        <Menu autoSelect={false} closeOnSelect={false}>
            <MenuButton type="button" background="white" fontSize="small" w={'100%'}>
                <Flex
                    align="center"
                    justifyContent="space-between"
                    fontWeight="normal"
                    borderRadius={'0.3rem'}
                    className={`${isInvalid ? styles.menuInvalid : styles.filterByButton} ${
                        field.required === false ? '' : styles.mandatory
                    }`}
                >
                    {!!values ? `${values.length} Selected` : <Text as="span">Select options</Text>}
                    <AiFillCaretDown fontSize="14px" />
                </Flex>
            </MenuButton>
            <MenuList>
                {options.length ? (
                    <>
                        {field.arguments.showSelectAll && (
                            <MenuItem key="selectAll">
                                <Checkbox
                                    isChecked={areAllValuesSelected}
                                    className={styles.checkbox}
                                    onChange={($event) => selectAllOptions($event)}
                                >
                                    Select All
                                </Checkbox>
                            </MenuItem>
                        )}
                        {options.map((option) => (
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
