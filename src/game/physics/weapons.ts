import { GAME_SIZE } from '../../const'
import { RectangularBody } from './bodies'

export class BulletBody extends RectangularBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość.
     * 
     * @param position - Pozycja startowa pocisku, umieszczona w jego centrum
     */
     constructor(
        positionX: number
    ) {
        super({ x: positionX, y: GAME_SIZE.y + GAME_SIZE.x / 2 }, { x: 10, y: GAME_SIZE.y }, true)

        this.speed.y -= 250
    }
}

export class PowerWireBody extends BulletBody {
    timeLeft: number = 5
}