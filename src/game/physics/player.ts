import { Keymap } from '../../const'
import { XYVar } from '../../types'
import { Body, RectangularBody } from './bodies'

export default class PlayerBody extends RectangularBody {
    moves = new Set()

    constructor(
        position: XYVar,
        size: XYVar
    ) {
        super(position, size, true)

        this.accelerate('gravity', { x: 0, y: 50 })

        window.addEventListener('keydown', event => this.moves.add(Object.entries(Keymap).find(key => key[1].includes(event.key))?.[0]))
        window.addEventListener('keyup', event => this.moves.delete(Object.entries(Keymap).find(key => key[1].includes(event.key))?.[0]))
    }

    override update(delta: number, colliders?: Body[]): void {
        this.speed.x = 0
        this.moves.forEach(move => {
            switch(move) {
                case 'UP':
                    // TODO: Ladder up.
                break;
                case 'DOWN':
                    // TODO: Ladder down.
                break;
                case 'LEFT':
                    this.speed.x = -50
                break;
                case 'RIGHT':
                    this.speed.x = 50
                break;
            }
        })

        super.update(delta, colliders)
    }
}