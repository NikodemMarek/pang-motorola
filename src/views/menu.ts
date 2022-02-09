import { Container } from 'pixi.js'
import { ButtonProperties } from '../types'
import Button from './button'

/**
 * Menu składające się z {@link views/button.default | przycisków}.
 */
export default class Menu extends Container {
    /**
     * Przyciski w menu są generowane na podstawie tablicy options, która określa reakcję na kliknięcie.
     * Dodatkowo każdy przycisk może posiadać properties, które nadpisują domyślne właściwości dla każdego przycisku.
     * 
     * Menu może być wyświetlane horyzontalnie lub wertykalnie (domyślnie wertykalnie).
     * Przerwy między przyciskami również są horyzontalne lub wertykalne w zależności od orientacji menu.
     * 
     * @param options - Tablica obiektów opisująca reakcje na kliknięcia i właściwości przycisków
     * @param properties - Domyślne właściwości przycisków
     * @param isHorizontal - Określa czy menu ma byc horyzontalne, czy wertykalne
     * @param space - Wielkość przerw między przyciskami
     */
    public constructor(
        options: Array<{
            onClick: Function,
            properties: ButtonProperties,
            hideMenuOnClick?: boolean
        }>,
        properties: ButtonProperties,
        isHorizontal: boolean = false, // True - horizontal, false - vertical.
        space: number = 1
    ) {
        super()

        let nextPosition = 0
        options.forEach(option => {
            const buttonProperties: ButtonProperties = option.properties != undefined? {
                label: option.properties.label || properties.label || '',
                size: option.properties.size || properties.size || { x: 200 ,y: 50 },
                texture: option.properties.texture || properties.texture,
                hoverTexture: option.properties.hoverTexture || properties.hoverTexture,
                labelColor: option.properties.labelColor || properties.labelColor || 0xffffff,
                labelHoverColor: option.properties.labelHoverColor || properties.labelHoverColor || option.properties.labelColor || properties.labelColor || 0xffffff
            }: {
                label: properties.label || '',
                size: properties.size || { x: 200 ,y: 50 },
                texture: properties.texture,
                hoverTexture: properties.hoverTexture,
                labelColor: properties.labelColor || 0xffffff,
                labelHoverColor: properties.labelHoverColor || properties.labelColor || 0xffffff
            }

            const optionButton = new Button(
                () => {
                    if(option.hideMenuOnClick != undefined? option.hideMenuOnClick: true) this.parent.removeChild(this)
                    
                    option.onClick()
                },
                buttonProperties
            )
            
            if(isHorizontal) {
                optionButton.position.set(nextPosition + buttonProperties.size!.x / 2, 0)
                nextPosition += buttonProperties.size!.x + space * 2
            } else {
                optionButton.position.set(0, nextPosition + buttonProperties.size!.y / 2)
                nextPosition += buttonProperties.size!.y + space * 2
            }

            this.addChild(optionButton)
        })

        if(isHorizontal) this.pivot.set(nextPosition / 2, 0)
        else this.pivot.set(0, nextPosition / 2)
    }
}