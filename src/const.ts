import { XYVar } from './types'

/**
 * Wartość określająca wymiary planszy.
 */
export const GAME_SIZE: XYVar = {
    x: 800,
    y: 500
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

export enum Guns {
    HARPOON,
    DOUBLE_WIRE,
    POWER_WIRE,
    VULCAN_MISSILE
}

/**
 * Domyślna mapa klawiszy którymi gracz porusza postać.
 */
export const Keymap = {
    UP: [ 'ArrowUp', 'w', 'W' ],
    DOWN: [ 'ArrowDown', 's', 'S' ],
    LEFT: [ 'ArrowLeft', 'a', 'A' ],
    RIGHT: [ 'ArrowRight', 'd', 'D' ],
    SHOOT: [ ' ', 'Shift', 'q', 'Q' ]
}