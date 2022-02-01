import { XYVar } from '../../types'
import { RectangularBody } from './bodies'

export class BulletBody extends RectangularBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość.
     * 
     * @param position - Pozycja startowa pocisku, umieszczona w jego centrum
     */
     constructor(
        position: XYVar
    ) {
        super(position, { x: 10, y: 10 }, false)

        this.speed.y -= 250
    }
}