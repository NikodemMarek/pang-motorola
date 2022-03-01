import { BallBody, LadderBody, PlatformBody, PointBody, PortalBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { BulletBody } from './game/physics/bullets'

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
   points: Array<PointBody>,
   /**
    * Lista portali na planszy.
    */
   portals: Array<PortalBody>
}
/**
 * Informacje o rozgrywce.
 */
export interface LevelInfo {
    /**
     * Uzyskany wynik na poziomie.
     */
    score: number,
    /**
     * Czas trwania gry.
     */
    time: number,
    /**
     * Czas pozostały do skończenia się bonusu zegara.
     */
    clockTimeLeft: number,
    /**
     * Czas pozostały do skończenia się bonusu klepsydry.
     */
    hourglassTimeLeft: number
}

/**
 * Typ opisujący statystyki w grze.
 */
export interface LevelData {
    /**
     * Stan obiektów w grze.
     */
    level: Level
    /**
     * Informacje o rozgrywce.
     */
    info: LevelInfo,
    /**
     * Nazwa poziomu.
     */
    name: string,
    /**
     * Wszystkie uzyskane punkty.
     */
    totalScore: number
}