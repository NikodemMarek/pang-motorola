import React from 'react'

/**
 * Włąściwości przcisku.
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