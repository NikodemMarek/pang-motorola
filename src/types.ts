import { Texture } from 'pixi.js'

/**
 * Typ opisujący właściwości przycisku.
 */
export interface ButtonProperties {
    /**
     * Napis na przycisku.
     */
    label?: string,
    /**
     * Szerokość przycisku.
     */
    width?: number,
    /**
     * Wysokość przycisku.
     */
    height?: number,
    /**
     * Grafika przysisku widoczna za {@link label | napisem}.
     */
    texture?: Texture,
    /**
     * Grafika przycisku która zastępuje {@link texture}, po najechaniu na przycisk.
     */
    hoverTexture?: Texture,
    /**
     * Kolor {@link label | napisu}.
     */
    labelColor?: number,
    /**
     * Kolor {@link label | napisu} po najechaniu na przycisk.
     */
    labelHoverColor?: number
}

/**
 * Typ opisujący pozycję/rozmiar w 2 wymiarach.
 */
export interface XYVar {
    x: number,
    y: number
}