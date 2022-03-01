import React from 'react'
import { Button, ButtonProps } from './Button'
import { InputField, InputFieldProps } from './InputField'

export interface MenuProps {
    elements: Array<ButtonProps | InputFieldProps>
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
            props.elements.map(
                (element, i) => (element as ButtonProps).label != undefined
                    ? <MenuButton
                        key={i}
                        label={(element as ButtonProps).label}
                        onClick={(element as ButtonProps).onClick}
                    />
                    : <InputField
                        key={i}
                        hint={(element as InputFieldProps).hint}
                        onSubmit={(element as InputFieldProps).onSubmit}
                    />
            )
        }
    </div>
}