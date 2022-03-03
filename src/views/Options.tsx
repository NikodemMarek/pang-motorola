import React from 'react'
import { getImagesSetsList } from '../assets-provider'
import { Button } from './Button'
import { Menu } from './Menu'

/**
 * Właściwości komponentu z opcjami gry.
 */
export interface OptionsProps {
    /**
     * Funkcja wykonująca się na wyjściu.
     */
    onExit: () => void,
    /**
     * Funkcja ładująca zestaw grafik.
     */
    onLoad: (set: number) => void,
    /**
     * Załadowany zestaw grafik.
     */
    loadedSet: number
}
/**
 * Komponent z opcjami gry.
 */
export class Options extends React.Component<OptionsProps, any> {
    /**
     * Renderuje komponent z opcjami gry.
     * 
     * @returns Komponent z opcjami gry
     */
    override render = () => { 
        return <div className='options'>
            <Menu
                elements={
                    getImagesSetsList().map((set, i) => {
                        return i == this.props.loadedSet
                        ? {
                            label: set.name,
                            onToggle: () => {  },
                            toggled: true
                        }
                        : {
                            label: set.name,
                            onClick: () => this.props.onLoad(i)
                        }
                    })
                }
            />
            <Button
                label={'Back'}
                onClick={this.props.onExit}
            />
        </div>
    }
}