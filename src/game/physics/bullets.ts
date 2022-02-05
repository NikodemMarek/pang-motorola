import { PLAYER_SIZE } from '../../const'
import { XYVar } from '../../types'
import { Body, RectangularBody } from './bodies'

/**
 * Klasa opisująca zachowanie pocisków.
 */
export class BulletBody extends RectangularBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość w górę na osi y.
     * 
     * @param position - Pozycja startowa kuli
     */
     constructor(
        position: XYVar,
    ) {
        super({ x: position.x, y: position.y }, { x: 10, y: 10 }, true)

        this.speed.y -= 250
    }
}

/**
 * Klasa opisująca zachowanie harpuna.
 */
export class HarpoonBody extends BulletBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość w górę na osi y.
     * 
     * @param position - Pozycja startowa kuli
     */
     constructor(
        position: XYVar,
    ) {
        super({ x: position.x, y: position.y })
        this.size.y = PLAYER_SIZE.y
    }

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
     override update(delta: number, colliders?: Body[]): void {
        const prePositionY = this.position.y

        super.update(delta, colliders)

        this.size.y += (prePositionY - this.position.y) * 2
    }
}

/**
 * Klasa opisująca zachowanie przewodów.
 */
export class PowerWireBody extends HarpoonBody {
    /**
     * Czas do zniknięcia przewodu.
     */
    timeLeft: number = 5

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * Wyłącza odświerzanie ciała, jeśli jego czas życia jest za długi.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
    override update(delta: number, colliders?: Body[]): void {
        if(this.speed.y == 0) this.timeLeft -= delta
        else super.update(delta, colliders)
    }
}

/**
 * Klasa opisująca zachowanie pocisku blastera.
 */
export class VulcanMissile extends BulletBody {
    /**
     * Tworzy pocisk w kształcie prostokąta, nadaje mu pozycję startową, wymiary i prędkość w górę na osi y.
     * 
     * @param position - Pozycja startowa pocisku
     */
     constructor(
        position: XYVar,
    ) {
        super({ x: position.x, y: position.y - PLAYER_SIZE.y / 2 })
    }

}
 