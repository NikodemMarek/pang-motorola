import { BallSize, GAME_SIZE } from '../../const'
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
     * Maksymalna wysokość którą osiągnęła piłka, przed rozpoczęciem opadania.
     */
    peakHeight: number
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
        this.accelerate('gravity', { x: 0, y: 50 })

        this.lastHeight = position.y
        this.peakHeight = position.y
    }

    /**
     * Funkcja sprawdza czy piłka nie opadła zbyt nisko.
     * Jeśli tak nadaje jej przyspieszenie w górę, aby wróciła powyżej minimalnej dozwolonej wysokości.
     * Następnie zmienia wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z piłką
     */
    override update(delta: number, colliders?: Body[]): void {
        super.update(delta, colliders)

        if(!this.isFalling && this.position.y > this.lastHeight) this.peakHeight = this.lastHeight
        else if(this.isFalling && this.position.y < this.lastHeight && this.peakHeight > GAME_SIZE.y * 2 / 3) this.speed.y = -140

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
     * Tworzy platformę w kształcie {@link RectangularBody | prostokąta}, nadaje jej pozycję startową i wymiary.
     * Domyślnie nadaje platformie kolizje.
     * 
     * @param position - Pozycja startowa platformy, umieszczona w jej centrum
     * @param size - Rozmiar platformy
     */
    constructor(
        position: XYVar,
        size: XYVar
    ) {
        super(position, size, true)
    }
}
