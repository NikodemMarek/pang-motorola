import { BitmapFont, BitmapText, Sprite } from 'pixi.js'
import { ButtonProperties } from '../types'

/**
 * Przycisk składający się z grafiki i/lub napisu.
 */
export default class Button extends Sprite {
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
        super(properties.texture)

        this.buttonMode = true
        this.width = properties.width || 100
        this.height = properties.height || 100
        
        BitmapFont.from('buttonLabelFont', {
            fontFamily: 'Noto Sans',
            fill: 0xffffff,
            fontSize: 30
        })

        const buttonLabel: BitmapText = new BitmapText(properties.label || '', {
            fontName: 'buttonLabelFont',
            tint: properties.labelColor || 0xffffff
        })
        buttonLabel.anchor.set(0.5, 0.5)
        this.addChild(buttonLabel)

        this.interactive = true
        this.on('click', () => onClick())
        if(properties.labelHoverColor != undefined) {
            this.on('mouseover', () => buttonLabel.tint = properties.labelHoverColor!!)
            this.on('mouseout', () => buttonLabel.tint = properties.labelColor || 0xffffff)
        }
        if(properties.hoverTexture != undefined) {
            this.on('mouseover', () => this.texture = properties.hoverTexture!!)
            this.on('mouseout', () => this.texture = properties.texture!! || properties.texture!!)
        }
    }
}