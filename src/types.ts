import { Texture } from 'pixi.js'
import { BallBody, LadderBody, PlatformBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { BulletBody } from './game/physics/weapons'

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

/**
 * Typ opisujący poziom w grze.
 */
 export interface Level {
    /**
    * Lista postaci w grze.
    */
   players: Array<PlayerBody>
   /**
    * Lista piłek w grze.
    */
   balls: Array<BallBody>
   /**
    * Lista pocisków w grze.
    */
   bullets: Array<BulletBody>
   /**
    * Lista platform w grze.
    */
   platforms: Array<PlatformBody>
   /**
    * Lista drabin w grze.
    */
   ladders: Array<LadderBody>
   /**
    * Lista bonusów w grze.
    */
   powerUps: Array<PowerUpBody>
}