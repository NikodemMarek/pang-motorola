import { BallSize, GAME_SIZE } from '../../const'
import { XYVar } from '../../types'
import { Body, CircularBody } from './bodies'

export default class BallBody extends CircularBody {
    lastHeight: number
    peakHeight: number
    isFalling: boolean = true

    constructor(
        position: XYVar,
        size: BallSize,
        speed: XYVar = { x: 0, y: 0 }
    ) {
        super(position, size, true)

        this.speed = speed
        this.accelerate('gravity', { x: 0, y: 50 })

        this.lastHeight = position.y
        this.peakHeight = position.y
    }

    override update(delta: number, colliders?: Body[]): void {
        super.update(delta, colliders)

        if(!this.isFalling && this.position.y > this.lastHeight) this.peakHeight = this.lastHeight
        else if(this.isFalling && this.position.y < this.lastHeight && this.peakHeight > GAME_SIZE.y * 2 / 3) this.accelerate('noFalling', { x: 0, y: -160 })
        else if(this.lastHeight < GAME_SIZE.y * 3 / 4) this.decelerate('noFalling')

        if(this.position.y > this.lastHeight) this.isFalling = true
        else this.isFalling = false

        this.lastHeight = this.position.y
    }
}