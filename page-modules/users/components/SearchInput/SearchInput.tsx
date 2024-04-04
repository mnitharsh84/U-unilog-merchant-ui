import { Box, Flex, Icon, Input, List, ListItem, Text } from '@chakra-ui/react'
import { User } from 'page-modules/users/type/type'
import { ChangeEvent, useState } from 'react'
import { RiCloseCircleLine } from 'react-icons/ri'

type Props = {
    fieldKey: string
    field: any
    userList: User[]
    selectUser: (params: any) => any
}
type StateType = User | null
export default function SelectInput({ fieldKey, field, userList, selectUser }: Props) {
    const [searchText, setSearchText] = useState('')
    const [selectedOption, setSelectedOption] = useState<StateType>(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const handleSearchTextChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value)
        setIsDropdownOpen(true)
    }

    const handleSelectOption = (option: User) => {
        setSelectedOption(option)
        setSearchText(option.username)
        selectUser(option)
        setIsDropdownOpen(false)
    }

    const handleInputFocus = () => {
        setIsDropdownOpen(true)
    }

    const handleInputBlur = () => {
        setTimeout(() => {
            setIsDropdownOpen(false)
        }, 200)
    }

    // Filter the options based on the searchText
    const filteredOptions = userList.filter((option) => {
        const searchTextLower = searchText.toLowerCase()

        return (
            !searchText ||
            ['username', 'firstName', 'lastName'].some((field) => {
                const fieldValue = option[field as keyof User] ? option[field as keyof User].toLowerCase() : ''
                return fieldValue.includes(searchTextLower)
            })
        )
    })

    const handleRemove = () => {
        setSearchText('')
        setSelectedOption(null)
    }

    return (
        <Box w="100%">
            <Input
                w={`100%`}
                size={'sm'}
                fontSize={'small'}
                background={'white'}
                borderRadius={'0.3rem'}
                placeholder={field.placeholder ?? 'Search and select an option...'}
                isDisabled={field.editable === false}
                errorBorderColor={'crimson'}
                className={`${!field.editable ? 'mandatory' : ''}`}
                value={searchText}
                onChange={handleSearchTextChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                autoComplete="off"
            />
            {isDropdownOpen && (
                <List
                    bg="white"
                    border="1px solid #ccc"
                    borderRadius="0.3rem"
                    borderColor="gray.200"
                    zIndex={1}
                    mt="2"
                    w="100%"
                >
                    {filteredOptions.map((option, index) => (
                        <ListItem
                            key={index}
                            px={4}
                            py={2}
                            _hover={{ bg: 'gray.100', cursor: 'pointer' }}
                            onClick={() => handleSelectOption(option)}
                        >
                            {option.username && <Text>{option.username}</Text>}
                        </ListItem>
                    ))}
                </List>
            )}
            <Flex alignItems="center" flexDir="row">
                <Text p="2">Selected User: {selectedOption?.username}</Text>{' '}
                {selectedOption?.username && (
                    <Icon cursor="pointer" onClick={() => handleRemove()} as={RiCloseCircleLine} boxSize={5} />
                )}
            </Flex>
        </Box>
    )
}
