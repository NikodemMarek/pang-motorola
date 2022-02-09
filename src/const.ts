import { XYVar } from './types'

/**
 * Wartość określająca wymiary okna.
 */
export const RENDERER_SIZE: XYVar = {
    x: 1200,
    y: 700
}
/**
 * Wartość określająca wymiary gry.
 */
export const GAME_SIZE: XYVar = {
    x: 1000,
    y: 650
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
    MENU_BUTTON = 'button-texture.png',
    MENU_BUTTON_HOVER = 'button-texture-hover.png',
    PLATFORM = 'pineapple.png',
    PLATFORM_BREAKABLE = 'pineapple.png',
    LADDER = 'pineapple.png',
    BALL = 'pineapple.png',
    POWER_UP = 'pineapple.png',
    PLAYER = 'pineapple.png',
    HARPOON = 'pineapple.png',
    POWER_WIRE = 'pineapple.png',
    VULCAN_MISSILE = 'pineapple.png',
    FORCE_FIELD = 'pineapple.png',
    HARPOON_POWER_UP = 'pineapple.png',
    DOUBLE_HARPOON_POWER_UP = 'pineapple.png',
    POWER_WIRE_POWER_UP = 'pineapple.png',
    VULCAN_MISSILE_POWER_UP = 'pineapple.png',
    FORCE_FIELD_POWER_UP = 'pineapple.png',
    HOURGLASS_POWER_UP = 'pineapple.png',
    CLOCK_POWER_UP = 'pineapple.png',
    DYNAMITE_POWER_UP = 'pineapple.png',
    BACKGROUND = 'pineapple.png'
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
    x: 70,
    y: 100
}

/**
 * Prędkość postaci w poziomie i podczas chodzenia po drabinie.
 */
export const PLAYER_SPEED: XYVar = {
    x: 100,
    y: 75
}

/**
 * Prędkość pocisków.
 */
export const BULLET_SPEED = -400

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
    HUGE = 80
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

/**
 * Określa w jakiej kolejności będą wyświetlane obiekty.
 */
export enum ZIndex {
    BACKGROUND,
    PLATFORM,
    LADDER,
    BALL,
    POWER_UP,
    PLAYER,
    BULLET
}