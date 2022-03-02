import React from 'react'
import { Button, ButtonProps, ToggleButton, ToggleButtonProps } from './Button'
import { InputField, InputFieldProps } from './InputField'

export interface MenuProps {
    elements: Array<ButtonProps | ToggleButtonProps | InputFieldProps | null>
}

const MenuElement = (props: { element: ButtonProps | ToggleButtonProps | InputFieldProps}) => {
    return <div className='menu-button'>
        {
        (props.element as ButtonProps).label != undefined
            ? (props.element as ToggleButtonProps).toggled != undefined
                ? <ToggleButton
                    label={(props.element as ToggleButtonProps).label}
                    onToggle={(props.element as ToggleButtonProps).onToggle}
                    toggled={(props.element as ToggleButtonProps).toggled}
                />
                : <Button
                    label={(props.element as ButtonProps).label}
                    onClick={(props.element as ButtonProps).onClick}
                />
            : <InputField
                hint={(props.element as InputFieldProps).hint}
                onSubmit={(props.element as InputFieldProps).onSubmit}
            />
        }
    </div>
}
  
export const Menu = (props: MenuProps) => {
    return <div className='menu'>
        {
            props.elements.map(
                (element, i) => element != null? <MenuElement
                    key={i}
                    element={element}
                />: null
            )
        }
    </div>
}