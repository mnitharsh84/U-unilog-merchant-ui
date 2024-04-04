import { Button } from '@chakra-ui/react'

export default function ActionButtons({ buttons }: any) {
    const handleButtonClick = (button: any) => {
        button.callback({ actionType: button.actionType })
    }
    return buttons.map((button: any) => <Button onClick={() => handleButtonClick(button)}>{button.label}</Button>)
}
