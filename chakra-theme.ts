import { inputAnatomy } from '@chakra-ui/anatomy'
import { StyleFunctionProps, extendTheme } from '@chakra-ui/react'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'
import { StepsTheme as StepsStyleConfig } from 'chakra-ui-steps'

const CustomSteps = {
    ...StepsStyleConfig,
    baseStyle: (props: StyleFunctionProps) => {
        return {
            ...StepsStyleConfig.baseStyle(props),
            label: {
                ...StepsStyleConfig.baseStyle(props).label,
            },
            iconLabel: {
                ...StepsStyleConfig.baseStyle(props).iconLabel,
                fontSize: '0',
            },
            steps: {
                ...StepsStyleConfig.baseStyle(props).steps,
            },
            description: {
                ...StepsStyleConfig.baseStyle(props).description,
                'whiteSpace': 'pre-line',
                'text-align': 'left',
                'marginLeft': '0.5rem',
            },
            stepIconContainer: {
                ...StepsStyleConfig.baseStyle(props).stepIconContainer,
                width: '1rem',
                height: '1rem',
                borderColor: '#A0AEC0',
                _activeStep: {
                    bg: 'gray.400',
                },
            },
        }
    },
}

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys)

const baseStyle = definePartsStyle({
    // define the part you're going to style
    field: {
        _disabled: {
            backgroundColor: `rgba(0,0,0,0.1)`,
        },
    },
})

export const inputTheme = defineMultiStyleConfig({ baseStyle })
// theme.js or your Chakra UI theme file

export const SwitchTheme = {
    defaultProps: {
        colorScheme: 'teal', // Set a custom color scheme name
    },
    baseStyle: () => ({
        track: {
            bg: 'gray.300', // Set the background color for the track
            height: '0.75rem', // Replace with your desired track height value
            padding: 0,
            alignItems: 'center',
        },
        thumb: {
            bg: 'gray.400', // Set the background color for the thumb
            _checked: {
                bg: 'teal.500', // Set the background color for the thumb when the Switch is on
            },
        },
    }),
    sizes: {
        lg: {
            trackHeight: '0.75rem', // Set the height of the track for size "lg"
            thumb: {
                w: '1.25rem', // Adjust the width of the thumb for size "lg"
                h: '1.25rem', // Adjust the height of the thumb for size "lg"
            },
        },
    },
}

const textStyles = {
    formFieldLabel: {
        fontFamily: 'body',
        fontWeight: 'bold',
        fontSize: '0.75rem',
        lineHeight: 'normal',
        color: 'secondary.100',
    },
}

export const theme = extendTheme({
    components: {
        Steps: CustomSteps,
        Input: inputTheme,
        Switch: SwitchTheme,
    },
    textStyles,
})
