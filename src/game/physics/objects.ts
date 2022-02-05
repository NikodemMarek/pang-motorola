import { BallSize, GAME_SIZE, GRAVITY, PLAYER_SIZE } from '../../const'
import { XYVar } from '../../types'
import { Body, CircularBody, RectangularBody } from './bodies'

/**
 * Klasa opisująca zachowanie piłek.
 */
export class BallBody extends CircularBody {
    /**
     * Wysokość piłki w ostatniej klatce.
     */
    lastHeight: number
    /**
     * Czy piłka opada?
     */
    isFalling: boolean = true

    /**
     * Tworzy piłkę w kształcie {@link CircularBody | koła}, nadaje jej pozycję startową.
     * Domyślnie nadaje piłce kolizje i odbicia, grawitację, oraz 1 z 4 wielkości.
     * 
     * @param position - Pozycja startowa platformy, umieszczona w jej centrum
     * @param size - Rozmiar platformy
     */
    constructor(
        position: XYVar,
        size: BallSize,
        speed: XYVar = { x: 0, y: 0 }
    ) {
        super(position, size, true, true)

        this.speed = speed
        this.accelerate('gravity', GRAVITY)

        this.lastHeight = position.y
    }

    /**
     * Funkcja sprawdza czy piłka nie opadła zbyt nisko.
     * Jeśli tak nadaje jej prędkość w górę, aby wróciła powyżej minimalnej dozwolonej wysokości.
     * Następnie zmienia wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z piłką
     */
    override update(delta: number, colliders?: Body[]): void {
        super.update(delta, colliders)

        if(this.isFalling && this.position.y < this.lastHeight || this.position.y >= GAME_SIZE.y - this.radius) this.speed.y = -PLAYER_SIZE.y * 2

        if(this.position.y > this.lastHeight) this.isFalling = true
        else this.isFalling = false

        this.lastHeight = this.position.y
    }
}

/**
 * Klasa opisująca zachowanie platform.
 */
export class PlatformBody extends RectangularBody {
    /**
     * Czy platformę można zniszczyć pociskiem.
     */
    isBreakable: boolean

    /**
     * Tworzy platformę w kształcie {@link RectangularBody | prostokąta}, nadaje jej pozycję startową i wymiary.
     * Domyślnie nadaje platformie kolizje.
     * 
     * @param position - Pozycja startowa platformy, umieszczona w jej centrum
     * @param size - Rozmiar platformy
     * @param isBreakable - Czy platformę można zniszczyć pociskiem
     */
    constructor(
        position: XYVar,
        size: XYVar,
        isBreakable: boolean = false
    ) {
        super(position, size, true)

        this.isBreakable = isBreakable
    }
}

/**
 * Klasa opisująca zachowanie drabiny.
 */
export class LadderBody extends RectangularBody {
    /**
     * Tworzy drabinę w kształcie {@link RectangularBody | prostokąta}, nadaje jej pozycję startową i wymiary.
     * Domyślnie nadaje drabinie kolizje.
     * 
     * @param position - Pozycja startowa drabiny, umieszczona w jej centrum
     * @param size - Rozmiar drabiny
     */
     constructor(
        position: XYVar,
        size: XYVar
    ) {
        super(position, size, true)
    }
}