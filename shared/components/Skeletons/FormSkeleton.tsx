import { Grid, Skeleton } from '@chakra-ui/react'

type Props = {
    rows: string
    columns: string
    colWidth?: string
    noOfColumnPerRow?: number
    marginTop?: number
}

export default function FormSkelton({ rows, columns, colWidth, noOfColumnPerRow, marginTop }: Props) {
    const skeletonArray = Array.from({ length: Number(rows) * Number(columns) })
    colWidth = colWidth ? colWidth : '100px'
    return (
        <Grid
            templateColumns={[
                '1fr',
                `repeat(${noOfColumnPerRow ? noOfColumnPerRow : 2}, 1fr)`,
                `repeat(${noOfColumnPerRow ? noOfColumnPerRow : 3}, 1fr)`,
                `repeat(${noOfColumnPerRow ? noOfColumnPerRow : 4}, 1fr)`,
            ]}
            columnGap={'1rem'}
            mt={4}
        >
            {skeletonArray.map((_, index) => (
                <Skeleton mt={`${marginTop ? marginTop : 4}`} key={index} height="30px" width="{colWidth}" />
            ))}
        </Grid>
    )
}
