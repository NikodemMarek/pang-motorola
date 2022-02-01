import { Container, Graphics } from 'pixi.js'
import { BallSize } from '../const'
import { CircularBody, RectangularBody } from './physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './physics/objects'
import PlayerBody from './physics/player'
import { BulletBody } from './physics/weapons'

export default class Game {
    public static states = {
        INIT: 0,
        RUNNING: 1,
        PAUSED: 1,
        FINISHED: 2
    }

    container: Container
    state: number = Game.states.INIT
    
    players: Array<PlayerBody>
    balls: Array<BallBody>
    bullets: Array<BulletBody>

    borders: Array<RectangularBody>
    platforms: Array<PlatformBody>
    ladders: Array<LadderBody>

    constructor(
        container: Container,
        players: Array<PlayerBody>,
        objects?: {
            balls?: Array<BallBody>
            bullets?: Array<BulletBody>
            borders?: Array<RectangularBody>,
            platforms?: Array<PlatformBody>,
            ladders?: Array<LadderBody>,
        }
    ) {
        this.container = container

        this.players = players
        this.balls = objects?.balls || [  ]
        this.bullets = objects?.bullets || [  ]

        this.borders = objects?.borders || [  ]
        this.platforms = objects?.platforms || [  ]
        this.ladders = objects?.ladders || [  ]
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
        this.players.forEach(player => player.update(delta, this.borders.concat(this.platforms), this.ladders))
        this.bullets.forEach(bullet => bullet.update(delta, this.borders.concat(this.platforms)))
        
        const ballsToAdd: Array<BallBody> = [  ]
        this.balls.forEach(ball => {
            const preSize = this.bullets.length
            this.bullets = this.bullets.filter(body => !(body instanceof BulletBody) || !ball.isColliding(body))

            if(this.bullets.length < preSize) {
                const newSize = ball.radius > BallSize.MEDIUM? ball.radius > BallSize.BIG? BallSize.MEDIUM: BallSize.BIG: ball.radius > BallSize.SMALL? BallSize.SMALL: 0

                ball.radius = 0
                ballsToAdd.push(
                    new BallBody(ball.position, newSize, { x: (ball.speed.x > 0? ball.speed.x: -ball.speed.x) + 50, y: ball.speed.y }),
                    new BallBody(ball.position, newSize, { x: (ball.speed.x > 0? -ball.speed.x: ball.speed.x) - 50, y: ball.speed.y })
                )
            }
        })
        this.balls = this.balls.filter(ball => ball.radius > 0)
        this.balls.push(... ballsToAdd)
            
        this.balls.forEach(ball => ball.update(delta, this.borders.concat(this.platforms)))
    }

    draw(graphics: Graphics) {
        graphics.clear()

        const d = (body: Body, colorNum: number) => {
            new VisualBody(body, [
                0xff0000,
                0x00ff00,
                0x0000ff,
                0xff00ff,
                0x000000
            ][colorNum]).draw(graphics)
        }

        this.platforms.forEach(_ => d(_ as unknown as Body, 0))
        this.ladders.forEach(_ => d(_ as unknown as Body, 1))
        this.balls.forEach(_ => d(_ as unknown as Body, 2))
        this.players.forEach(_ => d(_ as unknown as Body, 3))
        this.bullets.forEach(_ => d(_ as unknown as Body, 4))
    }
}

//////////////////////////////////////////////////////////////////////////////////////////
// Tymczasowa klasa pozwalająca na wyświetlenie każdego obiektu które jest dzieckiem Body.
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

        if(this.body instanceof CircularBody) graphics.drawCircle(this.body.position.x, this.body.position.y, this.body.radius)
        else if(this.body instanceof RectangularBody) graphics.drawRect(this.body.position.x - this.body.size.x / 2, this.body.position.y - this.body.size.y / 2, this.body.size.x, this.body.size.y)

        graphics.endFill()
    }

    changeColor(color: number) { this.color = color }
}
