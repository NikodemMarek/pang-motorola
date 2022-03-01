import React from 'react'
import { Button, ButtonProps } from './Button'

export interface MenuProps {
    buttons: Array<ButtonProps>
}

const MenuButton = (props: ButtonProps) => {
    return <div className='menu-button'>
        <Button
            label={props.label}
            onClick={props.onClick}
        />
    </div>
}
  
export const Menu = (props: MenuProps) => {
    return <div className='menu'>
        {
            props.buttons.map(
                (button, i) => <MenuButton
                    key={i}
                    label={button.label}
                    onClick={button.onClick}
                />
            )
        }
    </div>
}