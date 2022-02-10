import { Texture } from 'pixi.js'
import { BallBody, LadderBody, PlatformBody, PointBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { BulletBody } from './game/physics/bullets'
import { Guns } from './const'

/**
 * Typ opisujący właściwości przycisku.
 */
export interface ButtonProperties {
    /**
     * Napis na przycisku.
     */
    label?: string,
    /**
     * Wielkość przycisku.
     */
    size?: XYVar
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
   /**
    * Lista punktów do zebrania w grze.
    */
   points: Array<PointBody>
}

/**
 * Typ opisujący statystyki w grze.
 */
export interface LevelInfo {
    /**
     * Liczba pozostałych żyć.
     */
    lives?: number,
    /**
     * Liczba uzyskanych punktów.
     */
    points?: number,
    /**
     * Czas trwania gry.
     */
    time?: number,
    /**
     * Obecnie posiadana broń.
     */
    gun?: Guns,
    /**
     * Ilość posiadanych tarcz.
     */
    forceFields?: number,
    /**
     * Czas pozostały do skończenia się bonusu tarczy.
     */
    forceFieldTimeLeft?: number,
    /**
     * Czas pozostały do skończenia się bonusu zegara.
     */
    clockTimeLeft?: number,
    /**
     * Czas pozostały do skończenia się bonusu klepsydry.
     */
    hourglassTimeLeft?: number
}