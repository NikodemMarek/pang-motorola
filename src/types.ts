import { Texture } from 'pixi.js'

export interface ButtonProperties {
    width?: number,
    height?: number,
    texture?: Texture,
    hoverTexture?: Texture,
    labelColor?: number,
    labelHoverColor?: number
}