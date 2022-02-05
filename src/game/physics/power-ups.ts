import { GRAVITY, PowerUp } from '../../const'
import { XYVar } from '../../types'
import { Body, RectangularBody } from './bodies'

export default class PowerUpBody extends RectangularBody {
    /**
     * Typ bonusu.
     */
    type: PowerUp
    /**
     * Pozostały czas na podniesienie bonusu.
     */
    timeLeft: number = 15

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
        this.accelerate('gravity', GRAVITY)
    }

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * Wyłącza odświerzanie ciała, jeśli jego czas życia jest za długi.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
    override update(delta: number, colliders?: Body[]): void {
        if(this.timeLeft > 0) super.update(delta, colliders)
        this.timeLeft -= delta
    }
}