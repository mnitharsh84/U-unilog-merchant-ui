import { Text, TextProps, Tooltip } from '@chakra-ui/react'

type Props = {
    text: string
    width?: string
    maxWidth?: string
    noOfLines?: number
    isTruncated?: boolean
    handleClick?: () => void // Define the onClick prop
    textProps?: TextProps
}

export default function TextWithTooltip({
    text,
    width,
    maxWidth,
    noOfLines,
    isTruncated = true,
    handleClick,
    textProps,
}: Props) {
    const multiLine = !!noOfLines ? true : false

    return (
        <Tooltip label={text}>
            {multiLine ? (
                <Text noOfLines={noOfLines} width={width} onClick={handleClick} {...textProps}>
                    {text}
                </Text>
            ) : (
                <Text isTruncated={isTruncated} width={width} maxWidth={maxWidth} onClick={handleClick} {...textProps}>
                    {text}
                </Text>
            )}
        </Tooltip>
    )
}
