import React from 'react'

/**
 * Właściwości przcisku.
 */
export interface ButtonProps {
    /**
     * Podpis na przycisku.
     */
    label: string,
    /**
     * Funkcja wykonująca się po kliknięciu.
     */
    onClick: () => void
}
/**
 * Przycisk.
 * 
 * @param props - Właściwości przycisku
 * @returns Przycisk
 */
export const Button = (props: ButtonProps) => {
    return <button className='button' onClick={props.onClick}>
        {props.label}
    </button>
}

/**
 * Właściwości przełącznika.
 */
export interface ToggleButtonProps {
    /**
     * Podpis na przełączniku.
     */
    label: string,
    /**
     * Funkcja wykonująca się po kliknięciu.
     */
    onToggle: () => void,
    /**
     * Czy przełącznik jest przełączony.
     */
    toggled: boolean
}
/**
 * Przełącznik.
 * 
 * @param props - Właściwości przełącznika
 * @returns Przełącznik
 */
export const ToggleButton = (props: ToggleButtonProps) => {
    return <button className={props.toggled? 'button-toggled': 'button'} onClick={props.onToggle}>
        {props.label}
    </button>
}