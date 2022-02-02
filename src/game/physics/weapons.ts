import { GAME_SIZE } from '../../const'
import { RectangularBody } from './bodies'

/**
 * Klasa opisująca zachowanie pocisków.
 */
export class BulletBody extends RectangularBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość w górę na osi y.
     * 
     * @param positionX - Pozycja startowa na osi x pocisku
     */
     constructor(
        positionX: number
    ) {
        super({ x: positionX, y: GAME_SIZE.y + GAME_SIZE.x / 2 }, { x: 10, y: GAME_SIZE.y }, true)

        this.speed.y -= 250
    }
}

/**
 * Klasa opisująca zachowanie przewodów.
 */
export class PowerWireBody extends BulletBody {
    /**
     * Czas do zniknięcia przewodu.
     */
    timeLeft: number = 5
}