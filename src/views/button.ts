import { BitmapText, Container, Sprite } from 'pixi.js'
import { ButtonProperties } from '../types'

/**
 * Przycisk składający się z grafiki i/lub napisu.
 */
export default class Button extends Container {
    /**
     * Przygotowuje przycisk do umieszczenia na ekranie.
     * Nadaje wielkość przyciskowi, pozycjonuje go, dodaje napis i wydarzenia po kliknięciu oraz najechaniu.
     * 
     * @param onClick - Funkcja która wykona się po naciśnięciu przycisku
     * @param properties - Właściwości przycisku
     */
    public constructor(
        onClick: Function,
        properties: ButtonProperties
    ) {
        super()

        const size = {
            x: properties.size!.x || 200,
            y: properties.size!.y || 50
        }

        this.pivot.set(size.x / 2, size.y / 2)
        
        this.buttonMode = true
        this.interactive = true
        this.on('click', () => onClick())

        const buttonTexture = new Sprite(properties.texture)
        buttonTexture.anchor.set(0.5, 0.5)
        buttonTexture.position.set(size.x / 2, size.y / 2)
        buttonTexture.width = size.x
        buttonTexture.height = size.y
        this.addChild(buttonTexture)
        
        if(properties.hoverTexture != undefined) {
            this.on('mouseover', () => buttonTexture.texture = properties.hoverTexture!!)
            this.on('mouseout', () => buttonTexture.texture = properties.texture!! || properties.texture!!)
        }

        const buttonLabel: BitmapText = new BitmapText(properties.label || '', {
            fontName: 'buttonLabelFont',
            tint: properties.labelColor || 0xffffff
        })
        buttonLabel.anchor.set(0.5, 0.5)
        buttonLabel.position.set(size.x / 2, size.y / 2)
        this.addChild(buttonLabel)

        if(properties.labelHoverColor != undefined) {
            this.on('mouseover', () => buttonLabel.tint = properties.labelHoverColor!!)
            this.on('mouseout', () => buttonLabel.tint = properties.labelColor || 0xffffff)
        }
    }
}