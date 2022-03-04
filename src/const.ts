import { XYVar } from './types'

/**
 * Wartość określająca wymiary okna.
 */
export const RENDERER_SIZE: XYVar = {
    x: 1000,
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
    MENU_BUTTON = 'button.png',
    MENU_BUTTON_HOVER = 'button-hover.png',
    PLATFORM = 'platform.png',
    PLATFORM_BREAKABLE = 'platform-break.png',
    PLATFORM_ICY = 'button-hover.png',
    LADDER = 'ladder.png',
    PORTAL = 'button.png',
    BALL = 'ball.png',
    PLAYER = 'player-still.png',
    HARPOON = 'harpoon.png',
    POWER_WIRE = 'wire.png',
    VULCAN_MISSILE = 'missile.png',
    FORCE_FIELD = 'forcefield.png',
    HARPOON_POWER_UP = 'harpoon.png',
    DOUBLE_HARPOON_POWER_UP = 'double-harpoon.png',
    POWER_WIRE_POWER_UP = 'wire-icon.png',
    VULCAN_MISSILE_POWER_UP = 'missile.png',
    FORCE_FIELD_POWER_UP = 'forcefield-icon.png',
    HOURGLASS_POWER_UP = 'hourglass.png',
    CLOCK_POWER_UP = 'pause.png',
    DYNAMITE_POWER_UP = 'dynamite.png',
    POINT = 'points.png',
    BACKGROUND = 'background.png',
    LIVE = 'heart.png'
}
/**
 * Nazwy animacji w formie enuma, dla poprawy czytelności.
 */
export enum AnimationPath {
    PLAYER_LSIDE = 'player-lside',
    PLAYER_RSIDE = 'player-side',
    PLAYER_LADDER = 'player-back'
}

/**
 * Ścieżki do dźwięków w grze.
 */
export enum SoundPath {
    BALL_POP = './sounds/ball-pop.mp3',
    LIVE_LOST = './sounds/live-lost.mp3',
    SHOT = './sounds/shot.mp3',
    VICTORY = './sounds/victory.mp3',
    BONUS_COLLECTED_1 = './sounds/bonus-collected-1.mp3',
    BONUS_COLLECTED_2 = './sounds/bonus-collected-2.mp3',
    POINT_COLLECTED = './sounds/point-collected.mp3'
}

/**
 * Stany gry.
 */
export enum GameState {
    INIT,
    RUNNING,
    PAUSED,
    SAVING_GAME,
    FINISHED
}

/**
 * Wartość określająca wymiary postaci.
 */
export const PLAYER_SIZE: XYVar = {
    x: 50,
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
    DYNAMITE,
    LIVE
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
    PORTAL,
    BALL,
    POWER_UP,
    POINT,
    PLAYER,
    BULLET,
    PAUSE_MENU
}

/**
 * Identyfikatory scen w formie enuma, dla lepszej czytelności.
 */
export enum Scenes {
    MAIN_MENU,
    LEVELS_CHOICE,
    CAMPAIGN,
    BONUS,
    CAMPAIGN_SAVED,
    BONUS_SAVED,
    SCOREBOARD,
    OPTIONS,
    GAME
}

/**
 * Domyślna głośność dźwięków w grze.
 */
export const VOLUME = 1

export const SCOREBOARD_SIZE = 10