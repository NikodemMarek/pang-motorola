import { Container, Graphics } from 'pixi.js'
import { CircularBody, RectangularBody } from './physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './physics/objects'
import PlayerBody from './physics/player'
import { Bullet } from './weapons'

export default class Game {
    public static states = {
        INIT: 0,
        RUNNING: 1,
        PAUSED: 1,
        FINISHED: 2
    }

    container: Container
    state: number = Game.states.INIT

    player: PlayerBody

    borders: Array<RectangularBody>
    platforms: Array<PlatformBody>
    ladders: Array<LadderBody>
    balls: Array<BallBody>

    constructor(
        container: Container,
        player: PlayerBody,
        borders: Array<RectangularBody>,
        objects?: {
            platforms?: Array<PlatformBody>,
            ladders?: Array<LadderBody>,
            balls?: Array<BallBody>,
            bullets?: Array<Bullet>
        }
    ) {
        this.container = container

        this.player = player

        this.borders = borders

        this.platforms = objects?.platforms || [  ]
        this.ladders = objects?.ladders || [  ]
        this.balls = objects?.balls || [  ]
    }

    start(graphics: Graphics, FPS: number = 30) {
        const frameTime = 1000 / FPS

        this.state = Game.states.RUNNING

        this.draw(graphics)
        setInterval(() => {
            if(this.state == Game.states.RUNNING) {
                this.update(frameTime / 1000)
                this.draw(graphics)
            }
        }, frameTime)
    }

    update(delta: number) {
        this.balls.forEach(ball => ball.update(delta, this.borders.concat(this.platforms)))
        this.player.update(delta, this.borders.concat(this.platforms), this.ladders)
    }

    draw(graphics: Graphics) {
        graphics.clear()

        ;([ ... this.borders, ... this.platforms, ... this.ladders, ... this.balls, this.player ] as Array<any> as Array<Body>).forEach(object => {
            new VisualBody(object, parseInt(`0x${((1<<24)*Math.random() | 0).toString(16)}`)).draw(graphics)
        })
    }
}

//////////////////////////////////////////////////////////////////////////////////////
// Tymczasowa klasa pozwalająca na wyświetlenie dowolnego obiektu z klasą bozową Body.
// TODO: Remove this.
class VisualBody {
    body: Body
    color: number

    constructor(body: Body, color: number) {
        this.body = body
        this.color = color
    }

    draw(graphics: Graphics) {
        graphics.beginFill(this.color)

        if (this.body instanceof CircularBody) graphics.drawCircle(this.body.position.x, this.body.position.y, this.body.radius)
        else if (this.body instanceof RectangularBody) graphics.drawRect(this.body.position.x - this.body.size.x / 2, this.body.position.y - this.body.size.y / 2, this.body.size.x, this.body.size.y)

        graphics.endFill()
    }

    changeColor(color: number) { this.color = color }
}