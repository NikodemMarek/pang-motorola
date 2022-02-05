import { XYVar } from './types'

/**
 * Wartość określająca wymiary planszy.
 */
export const GAME_SIZE: XYVar = {
    x: 800,
    y: 500
}

/**
 * Bazowe ścieżki do zasobów.
 */
export enum BasePath {
    IMAGES = './images/',
    LEVELS = './levels/'
}

/**
 * Nazwy grafik w formie enuma, dla poprawy czytelności.
 */
export enum ImagePath {
    PINE = 'pineapple.png',
    MENU_BUTTON = 'button-texture.png',
    MENU_BUTTON_HOVER = 'button-texture-hover.png'
}
/**
 * Nazwy animacji w formie enuma, dla poprawy czytelności.
 */
export enum AnimationPath {
    LOADING = 'loading/lo'
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
 * Wartość określająca wymiary postaci.
 */
export const PLAYER_SIZE: XYVar = {
    x: 50,
    y: 80
}

/**
 * Globalna wartość grawitacji.
 */
export const GRAVITY: XYVar = {
    x: 0,
    y: 100
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