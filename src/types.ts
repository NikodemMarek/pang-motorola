import { Texture } from 'pixi.js'

/**
 * Typ opisujący właściwości przycisku.
 */
export interface ButtonProperties {
    /**
     * Szerokość przycisku.
     */
    width?: number,
    /**
     * Wysokość przycisku.
     */
    height?: number,
    /**
     * Grafika przysisku widoczna za napisem.
     */
    texture?: Texture,
    /**
     * Grafika przycisku która zastępuje {@link texture}, po najechaniu na przycisk.
     */
    hoverTexture?: Texture,
    /**
     * Kolor napisu.
     */
    labelColor?: number,
    /**
     * Kolor napisu po najechaniu na przycisk.
     */
    labelHoverColor?: number
}