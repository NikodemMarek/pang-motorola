import { XYVar } from './types'

/**
 * Wartość określająca wymiary planszy.
 */
export const GAME_SIZE: XYVar = {
    x: 800,
    y: 500
}

export enum BasePath {
    LEVELS = './levels/'
}

/**
 * Stany gry.
 */
export enum GameState {
    INIT,
    RUNNING,
    PAUSED,
    FINISHED
}

/**
 * Ustalone wymiary 4 wielkości piłek.
 */
export enum BallSize {
    SMALL = 10,
    MEDIUM = 20,
    BIG = 40,
    HUGE = 60
}

/**
 * Rodzaje broni dostępne w grze.
 */
export enum Guns {
    HARPOON,
    DOUBLE_HARPOON,
    POWER_WIRE,
    VULCAN_MISSILE
}

/**
 * Rodzaje bonusów dostępnych w grze.
 */
export enum PowerUp {
    HARPOON,
    DOUBLE_HARPOON,
    POWER_WIRE,
    VULCAN_MISSILE,
    FORCE_FIELD,
    HOURGLASS,
    CLOCK,
    DYNAMITE
}

/**
 * Domyślna mapa klawiszy którymi gracz porusza postać i strzela.
 */
export const Keymap = {
    UP: [ 'ArrowUp', 'w', 'W' ],
    DOWN: [ 'ArrowDown', 's', 'S' ],
    LEFT: [ 'ArrowLeft', 'a', 'A' ],
    RIGHT: [ 'ArrowRight', 'd', 'D' ],
    SHOOT: [ ' ', 'Shift', 'q', 'Q' ]
}