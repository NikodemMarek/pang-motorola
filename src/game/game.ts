import { Container, Graphics } from 'pixi.js'
import { BallSize, GameState, Guns } from '../const'
import { CircularBody, RectangularBody } from './physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './physics/objects'
import PlayerBody from './physics/player'
import PowerUpBody from './physics/power-ups'
import { BulletBody, PowerWireBody } from './physics/weapons'

/**
 * Klasa odpowiedzialna za kontrolowanie prędkości gry i klatek.
 * Przechowuje stan gry i wszystkie obiekty w grze.
 * Odświeża i wyświetla obiekty w grze.
 * 
 */
export default class Game {
    /**
     * Pojemnik w którym będzie wyświetlała się gra.
     */
    container: Container
    /**
     * Obecny stan gry.
     */
    state = GameState.INIT
    
    /**
     * Lista postaci w grze.
     */
    players: Array<PlayerBody>
    /**
     * Lista piłek w grze.
     */
    balls: Array<BallBody>
    /**
     * Lista pocisków w grze.
     */
    bullets: Array<BulletBody>

    /**
     * Granice przestrzeni gry.
     */
    borders: Array<RectangularBody>
    /**
     * Lista platform w grze.
     */
    platforms: Array<PlatformBody>
    /**
     * Lista drabin w grze.
     */
    ladders: Array<LadderBody>
    /**
     * Lista bonusów w grze.
     */
    powerUps: Array<PowerUpBody>

    /**
     * Przypisuje pojemnik na grę, i dodaje postacie, oraz obiekty do gry.
     * Przypisuje funkcje strzelania każdej postaci w grze.
     * 
     * @param container - Pojemnik na grę
     * @param players - Lista graczy w grze
     * @param objects - Listay obiektów w grze
     */
    constructor(
        container: Container,
        players: Array<PlayerBody>,
        objects?: {
            balls?: Array<BallBody>
            bullets?: Array<BulletBody>
            borders?: Array<RectangularBody>,
            platforms?: Array<PlatformBody>,
            ladders?: Array<LadderBody>,
            powerUps?: Array<PowerUpBody>,
        }
    ) {
        this.container = container

        this.players = players
        this.balls = objects?.balls || [  ]
        this.bullets = objects?.bullets || [  ]

        this.borders = objects?.borders || [  ]
        this.platforms = objects?.platforms || [  ]
        this.ladders = objects?.ladders || [  ]
        this.powerUps = objects?.powerUps || [  ]

        this.players.forEach(player => player.shoot = () => {
            if(player.gun == Guns.POWER_WIRE) this.bullets.push(new PowerWireBody(player.position.x))
            else this.bullets.push(new BulletBody(player.position.x))
        })
    }

    /**
     * Rozpoczyna grę.
     * Zmienia stan gry, oblicza czas na odświeżenie gry i uruchamia pętlę gry.
     * 
     * @param graphics - Obiekt pozwalający na rysowanie kształtów
     * @param FPS - Oczekiwana ilość odświeżeń i klatek na sekundę
     */
    start(graphics: Graphics, FPS: number = 30) {
        const frameTime = 1000 / FPS

        this.state = GameState.RUNNING
        
        this.draw(graphics)
        setInterval(() => {
            if(this.state == GameState.RUNNING) {
                this.update(frameTime / 1000)
                this.draw(graphics)
            }
        }, frameTime)
    }

    /**
     * Odświeża wszystkie obiekty w grze.
     * Dzieli piłki trafione przez pocisk.
     * 
     * @param delta - Czas który upłynął od ostatniego odświeżenia
     */
    update(delta: number) {
        this.powerUps = this.powerUps.filter(powerUp => powerUp.timeLeft > 0)
        this.powerUps.forEach(powerUp => powerUp.update(delta, [ this.borders[1] ].concat(this.platforms)))

        this.players.forEach(player => {
            player.update(delta, this.borders.concat(this.platforms), this.ladders)
            
            this.powerUps.forEach(powerUp => {
                if(player.isColliding(powerUp)) {
                    player.powerUp(powerUp.type)
                    powerUp.timeLeft = 0
                }
            })
        })

        this.bullets.forEach(bullet => bullet.update(delta, [ this.borders[0] ].concat(this.platforms)))
        
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

        this.bullets = this.bullets.filter(bullet => bullet instanceof PowerWireBody? bullet.timeLeft > 0: bullet.speed.y < 0)

        this.powerUps = this.powerUps.filter(powerUp => powerUp.timeLeft > 0)
        this.powerUps.forEach(powerUp => powerUp.update(delta, [ this.borders[1] ].concat(this.platforms)))
    }

    /**
     * Wyświetla obiekty w pojemniku gry.
     * 
     * @param graphics - Obiekt pozwalający na rysowanie kształtów
     */
    draw(graphics: Graphics) {
        graphics.clear()

        const d = (body: Body, colorNum: number) => {
            new VisualBody(body, [
                0xff0000,
                0x00ff00,
                0x0000ff,
                0xff00ff,
                0x000000,
                0x0ffff0
            ][colorNum]).draw(graphics)
        }

        this.platforms.forEach(_ => d(_ as unknown as Body, 0))
        this.ladders.forEach(_ => d(_ as unknown as Body, 1))
        this.balls.forEach(_ => d(_ as unknown as Body, 2))
        this.players.forEach(_ => d(_ as unknown as Body, 3))
        this.bullets.forEach(_ => d(_ as unknown as Body, 4))
        this.powerUps.forEach(_ => d(_ as unknown as Body, 5))
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
