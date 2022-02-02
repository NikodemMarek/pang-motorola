import { PowerUp } from '../../const'
import { XYVar } from '../../types'
import { RectangularBody } from './bodies'

export default class PowerUpBody extends RectangularBody {
    /**
     * Typ bonusu.
     */
    type: PowerUp

    /**
     * Tworzy bonus w kształcie prostokąta, nadaje mu pozycję startową i wymiary, opadanie, oraz typ.
     * 
     * @param position - Pozycja startowa bonusu, umieszczona w jego centrum
     * @param type - Typ bonusu
     */
     constructor(
        position: XYVar,
        type: PowerUp
    ) {
        super(position, { x: 40, y: 60 }, true)
        
        this.type = type
        this.accelerate('gravity', { x: 0, y: 50 })
    }
}