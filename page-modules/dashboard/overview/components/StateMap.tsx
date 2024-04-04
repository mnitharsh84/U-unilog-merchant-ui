import { Card, CardBody, CardHeader, Center, Divider, Select, Text } from '@chakra-ui/react'
import { useState } from 'react'
import DatamapsIndia from 'react-datamaps-india'
import { AiFillCaretDown } from 'react-icons/ai'
import ErrorPlaceholder from 'shared/components/ErrorPlaceholder/ErrorPlaceholder'
import Loading from 'shared/components/Loading/Loading'

import { useOverviewStateSplit } from '../hooks/queries'
import { STATE_CODE_MAP } from '../utils'
import styles from './StateMap.module.scss'

export default function StateMap() {
    const [category, setCategory] = useState<string>('Orders')
    const { data, isLoading, isError } = useOverviewStateSplit()

    return (
        <>
            <Card>
                <CardHeader
                    py={3}
                    fontWeight="bold"
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignItems={'center'}
                >
                    <Text>Courier Split By State</Text>
                    <Select
                        width={'auto'}
                        size={'sm'}
                        fontSize={'small'}
                        background={'white'}
                        borderRadius={'0.3rem'}
                        icon={<AiFillCaretDown fontSize={'14px'} />}
                        onChange={(e) => setCategory(e.target.value)}
                        value={category}
                    >
                        {data?.length ? (
                            data.map((type) => (
                                <option key={type.category} value={type.category}>
                                    {type.category}
                                </option>
                            ))
                        ) : (
                            <option disabled>No Options Available</option>
                        )}
                    </Select>
                </CardHeader>
                <Divider />
                {isLoading && (
                    <Center w={'500px'} h={'400px'}>
                        <Loading />
                    </Center>
                )}
                {isError && (
                    <Center w={'500px'} h={'400px'}>
                        <ErrorPlaceholder />
                    </Center>
                )}
                <CardBody className={styles.map}>
                    {data && (
                        <>
                            {category && (
                                <DatamapsIndia
                                    regionData={data
                                        .find((type) => type.category === category)
                                        ?.state_wise_count.reduce<Record<string, { value: number }>>((prev, curr) => {
                                            if (prev.hasOwnProperty(STATE_CODE_MAP[curr.title]))
                                                prev[STATE_CODE_MAP[curr.title]] = {
                                                    value: prev[STATE_CODE_MAP[curr.title]].value + curr.value,
                                                }
                                            else prev[STATE_CODE_MAP[curr.title]] = { value: curr.value }
                                            return prev
                                        }, {})}
                                    hoverComponent={({ value }: { value: { name: string; value: string } }) => {
                                        return (
                                            <>
                                                <p>{value.name}</p>
                                                <p>{value.value}</p>
                                            </>
                                        )
                                    }}
                                    mapLayout={{
                                        title: '',
                                        startColor: '#2c5282',
                                        endColor: '#bee3f8',
                                        hoverTitle: 'Count',
                                        noDataColor: '#f5f5f5',
                                        borderColor: '#8D8D8D',
                                        hoverBorderColor: '#8D8D8D',
                                        hoverColor: '#9AE6B4',
                                    }}
                                />
                            )}
                            {!category && (
                                <Center w={'100%'} h={'100%'}>
                                    <Text textAlign={`center`} fontSize="xs" color="gray.500">
                                        No records found.
                                    </Text>
                                </Center>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>
        </>
    )
}
