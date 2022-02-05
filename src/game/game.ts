import { Container, Graphics } from 'pixi.js'
import { BallSize, GameState, GAME_SIZE, Guns, PowerUp } from '../const'
import { Level } from '../types'
import { CircularBody, RectangularBody } from './physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './physics/objects'
import PlayerBody from './physics/player'
import PowerUpBody from './physics/power-ups'
import { BulletBody, HarpoonBody, PowerWireBody, VulcanMissile } from './physics/bullets'
import { Body } from './physics/bodies'

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
     * Czas który pozostał do zakończenia się bonusu spowolnienia czasu.
     */
    hourglassTimeLeft: number = 0
    /**
     * Czas który pozostał do zakończenia się bonusu zatrzymania czasu.
     */
    clockTimeLeft: number = 0
    /**
     * Pozostałe podziały piłek, spowodowane bonusem dynamit.
     */
    dynamiteSplits: number = 0
    /**
     * Czas pomiędzy podziałami piłek spowodowanymi bonusem dynamit
     */
    splitCooldown: number = 0

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
        level: Level
    ) {
        this.container = container

        this.players = level.players
        this.balls = level.balls || [  ]
        this.bullets = level.bullets || [  ]

        this.borders = [
            new RectangularBody({ x: GAME_SIZE.x / 2, y: 0 }, { x: GAME_SIZE.x, y: 0 }, true),
            new RectangularBody({ x: GAME_SIZE.x / 2, y: GAME_SIZE.y }, { x: GAME_SIZE.x, y: 0 }, true),
            new RectangularBody({ x: 0, y: GAME_SIZE.y / 2 }, { x: 0, y: GAME_SIZE.y }, true),
            new RectangularBody({ x: GAME_SIZE.x, y: GAME_SIZE.y / 2 }, { x: 0, y: GAME_SIZE.y }, true)
        ]
        this.platforms = level.platforms || [  ]
        this.ladders = level.ladders || [  ]
        this.powerUps = level.powerUps || [  ]

        this.players.forEach(player => player.shoot = () => {
            if(player.gun == Guns.POWER_WIRE) this.bullets.push(new PowerWireBody({ x: player.position.x, y: player.position.y }))
            if(player.gun == Guns.VULCAN_MISSILE) this.bullets.push(new VulcanMissile({ x: player.position.x, y: player.position.y }))
            else this.bullets.push(new HarpoonBody({ x: player.position.x, y: player.position.y }))
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
     * Zakańcza grę.
     */
    finish() {
        this.state = GameState.FINISHED
    }

    /**
     * Odświeża wszystkie obiekty w grze.
     * Dzieli piłki trafione przez pocisk.
     * 
     * @param delta - Czas który upłynął od ostatniego odświeżenia
     */
    update(delta: number) {
        this.bullets.forEach(bullet => bullet.update(delta))

        const newPlatforms = this.platforms.filter(platform => !this.bullets.some(bullet => bullet.isColliding(platform)))
        this.bullets = this.bullets.filter(bullet => !this.platforms.some(platform => platform.isColliding(bullet)))
        this.platforms = newPlatforms

        this.bullets.forEach(bullet => bullet.update(0, [ this.borders[0] ].concat(this.platforms)))

        const ballsToAdd: Array<BallBody> = [  ]
        const splitBall = (ball: BallBody) => {
            const newSize = ball.radius > BallSize.MEDIUM? ball.radius > BallSize.BIG? BallSize.BIG: BallSize.MEDIUM: ball.radius > BallSize.SMALL? BallSize.SMALL: 0

            ball.radius = 0
            ballsToAdd.push(
                new BallBody(ball.position, newSize, { x: (ball.speed.x > 0? ball.speed.x: -ball.speed.x) + 50, y: ball.speed.y }),
                new BallBody(ball.position, newSize, { x: (ball.speed.x > 0? -ball.speed.x: ball.speed.x) - 50, y: ball.speed.y })
            )
        }

        if(this.dynamiteSplits > 0 && this.splitCooldown <= 0) {
            this.balls.forEach(ball => { if(ball.radius > BallSize.SMALL) splitBall(ball) })

            this.dynamiteSplits --
            this.splitCooldown = 1
        }
        
        this.balls.forEach(ball => {
            const preSize = this.bullets.length
            this.bullets = this.bullets.filter(body => !(body instanceof BulletBody) || !ball.isColliding(body))

            if(this.bullets.length < preSize) splitBall(ball)
        })
        this.balls = this.balls.filter(ball => ball.radius > 0)
        this.balls.push(... ballsToAdd)
            
        this.balls.forEach(ball => ball.update(this.clockTimeLeft > 0? 0: this.hourglassTimeLeft > 0? delta / 3: delta, this.borders.concat(this.platforms)))

        this.powerUps = this.powerUps.filter(powerUp => powerUp.timeLeft > 0)
        this.powerUps.forEach(powerUp => powerUp.update(delta, [ this.borders[1] ].concat(this.platforms)))

        this.players.forEach(player => {
            this.balls = this.balls.filter(ball => {
                if(player.isColliding(ball)) {
                    if(player.forceFields > 0) player.forceFields --
                    else this.finish()

                    return false
                } else return true
            })

            player.update(delta, this.borders.concat(this.platforms), this.ladders)
            
            this.powerUps.forEach(powerUp => {
                if(player.isColliding(powerUp)) {
                    switch(powerUp.type) {
                        case PowerUp.HOURGLASS:
                            this.hourglassTimeLeft += 25
                        break;
                        case PowerUp.CLOCK:
                            this.clockTimeLeft += 10
                        break;
                        case PowerUp.DYNAMITE:
                            this.dynamiteSplits = 3
                        break;
                        default:
                            player.powerUp(powerUp.type)
                    }

                    powerUp.timeLeft = 0
                }
            })
        })

        this.bullets = this.bullets.filter(bullet => bullet instanceof PowerWireBody? bullet.timeLeft > 0: bullet.speed.y < 0)

        this.powerUps = this.powerUps.filter(powerUp => powerUp.timeLeft > 0)
        this.powerUps.forEach(powerUp => powerUp.update(delta, [ this.borders[1] ].concat(this.platforms)))

        if(this.hourglassTimeLeft > 0) this.hourglassTimeLeft -= delta
        else this.hourglassTimeLeft = 0
        if(this.clockTimeLeft > 0) this.clockTimeLeft -= delta
        else this.clockTimeLeft = 0
        if(this.splitCooldown > 0) this.splitCooldown -= delta
        else this.splitCooldown = 0
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
        this.players.forEach(_ => d(_ as unknown as Body, _.forceFields))
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
