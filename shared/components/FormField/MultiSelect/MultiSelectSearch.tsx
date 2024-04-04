import {
    Box,
    Checkbox,
    Flex,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from '@chakra-ui/react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getSearchApi } from 'apis/get'
import { useFormikContext } from 'formik'
import { getIn } from 'formik'
import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { AiFillCaretDown } from 'react-icons/ai'
import { RiCloseCircleLine } from 'react-icons/ri'
import { FixedSizeList } from 'react-window'
import { Field, SearchFieldApiDetail } from 'shared/types/forms'

import styles from './MultiSelect.module.scss'

type Props = {
    fieldKey: string
    field: Field<'multi_select_search'>
    changeValue?: (param: { value: string; field: Field<'multi_select_search'>; fieldKey: string }) => void
    searchFieldApiDetail?: SearchFieldApiDetail
}

export default function MultiSelectSearch({ field, fieldKey, changeValue, searchFieldApiDetail }: Props) {
    const formik = useFormikContext()
    const queryClient = useQueryClient()

    const values: string[] = formik.values?.[fieldKey as keyof typeof formik.values] || []
    const menuRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            const e = event as MouseEvent
            let currentElement = e.target as HTMLElement
            while (currentElement !== document.body) {
                if (
                    currentElement &&
                    currentElement.classList &&
                    currentElement.classList.contains('chakra-menu__menu-list')
                ) {
                    // Found a parent element with the desired class
                    // You can perform any actions you need here
                    return
                }

                currentElement = currentElement.parentNode as HTMLElement
            }
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                // Clicked outside the menu, close it
                closeMenu()
            }
        }

        // Add the event listener when the component mounts
        window.addEventListener('mousedown', handleClickOutside)

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const onCheckboxChange = (ev: ChangeEvent<HTMLInputElement>, key: string) => {
        // ev.stopPropagation()
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

    const [searchText, setSearchText] = useState('')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [options, setOptions] = useState<any>([])
    let debounceTimeout: NodeJS.Timeout | null = null

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const handleSearchText = (inputText: string) => {
        setSearchText(inputText)
        if (searchFieldApiDetail && searchFieldApiDetail.url && !!inputText && inputText.length > 2) {
            // Clear the previous debounce timeout, if any
            if (debounceTimeout) {
                clearTimeout(debounceTimeout)
            }

            // Set a new debounce timeout
            debounceTimeout = setTimeout(() => {
                if (searchFieldApiDetail && searchFieldApiDetail.url && inputText.length > 2) {
                    queryClient.invalidateQueries(['get-search-result', inputText])
                }
            }, 300) // Adjust the debounce delay (e.g., 300 milliseconds)
        }
    }

    const searchApiUrl = searchFieldApiDetail?.url ? searchFieldApiDetail?.url : ''

    const {} = useQuery({
        queryKey: ['get-search-result', searchText], // Include searchText in the queryKey
        queryFn: () => getSearchApi(`${searchApiUrl}?keyword=${searchText}`),
        refetchOnWindowFocus: false,
        refetchInterval: false,
        retry: 0,
        enabled: searchFieldApiDetail && !!searchText && searchText.length > 2, // Only enable the query when searchText is not empty
        onSuccess: (data) => {
            // Refetch data after a successful update
            handleQuerySuccess(data)
        },
        onError: (error) => {
            console.error('An error occurred:', error)
            // You can set state or perform other actions here based on the error
        },
    })
    const handleQuerySuccess = (data: any) => {
        field.options = [...data]
        setOptions([...data])
        setIsMenuOpen(true)
    }

    const handleRemove = (code: string) => {
        formik.setFieldValue(
            fieldKey,
            values.filter((value) => value !== code),
        )
    }

    return (
        <>
            <Flex flexDirection="column">
                <Box w="100%" overflowX="auto" overflowY="auto" maxH="200px">
                    {' '}
                    {/* Adjust maxH as needed */}
                    <Flex flexDirection="column">
                        {/* {values.length > 0 && (
                <Text as="span" p="2">
                    Selected Values:
                </Text>
                )} */}
                        {values.map((value, index) => (
                            <Flex alignItems="center" key={index}>
                                <Text as="span" p="2">
                                    {value}
                                </Text>
                                <Icon
                                    cursor="pointer"
                                    onClick={() => handleRemove(value)}
                                    as={RiCloseCircleLine}
                                    boxSize={5}
                                />
                            </Flex>
                        ))}
                    </Flex>
                </Box>

                <Menu isOpen={isMenuOpen} autoSelect={false} closeOnSelect={false}>
                    <Flex flexDirection="column" w="100%" position="relative" ref={menuRef}>
                        <InputGroup
                            position="absolute"
                            onClick={toggleMenu}
                            w={`100%`}
                            style={{ display: 'block', zIndex: '2' }}
                        >
                            <Input
                                w={`100%`}
                                size={'sm'}
                                fontSize={'small'}
                                background={'white'}
                                borderRadius={'0.3rem'}
                                isDisabled={field.editable === false}
                                isInvalid={isInvalid}
                                errorBorderColor={'crimson'}
                                className={`${!field.editable ? 'mandatory' : ''}`}
                                placeholder={!!values.length ? `${values.length} Selected` : `Select options`}
                                value={searchText}
                                onChange={(e) => handleSearchText(e.target.value)}
                                autoComplete="off"
                            />
                            <InputRightElement h="8">
                                <AiFillCaretDown fontSize="14px" />
                            </InputRightElement>
                        </InputGroup>

                        <MenuButton
                            h="8"
                            style={{ zIndex: '1' }}
                            type="button"
                            background="white"
                            fontSize="small"
                            w={'100%'}
                        ></MenuButton>
                    </Flex>

                    <MenuList style={{ zIndex: '2' }}>
                        {options.length ? (
                            <>
                                {/* Use FixedSizeList instead of mapping MenuItems */}
                                <FixedSizeList
                                    height={options.length < 6 ? options.length * 50 : 300} // Adjust this height as needed
                                    width={'100%'}
                                    itemSize={50} // Adjust this size as needed
                                    itemCount={options.length}
                                >
                                    {({ index, style }) => (
                                        <div style={style}>
                                            <MenuItem key={options[index].code}>
                                                <Checkbox
                                                    isChecked={values.includes(options[index].code)}
                                                    onChange={($event) => onCheckboxChange($event, options[index].code)}
                                                    className={styles.checkbox}
                                                >
                                                    <Text className={styles.overflowText} fontSize="xs">
                                                        {options[index].displayName}
                                                    </Text>
                                                </Checkbox>
                                            </MenuItem>
                                        </div>
                                    )}
                                </FixedSizeList>
                            </>
                        ) : (
                            <MenuItem isDisabled={true}>No Options Available</MenuItem>
                        )}
                    </MenuList>
                </Menu>
            </Flex>
        </>
    )
}
