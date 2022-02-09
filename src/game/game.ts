import { Container } from 'pixi.js'
import { BallSize, GameState, GAME_SIZE, Guns, PowerUp } from '../const'
import { Level } from '../types'
import { RectangularBody } from './physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './physics/objects'
import PlayerBody from './physics/player'
import PowerUpBody from './physics/power-ups'
import { BulletBody, HarpoonBody, PowerWireBody, VulcanMissile } from './physics/bullets'
import BodiesDrawer from './bodies-drawer'
import SideMenu from '../views/side-menu'

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
    bodiesDrawer: BodiesDrawer
    sideMenu: SideMenu
    /**
     * Obecny stan gry.
     */
    state = GameState.INIT

    time: number = 0
    
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
     * @param level - Dane poziomu
     */
    constructor(
        container: Container,
        bodiesDrawer: BodiesDrawer,
        level: Level
    ) {
        this.container = container
        this.bodiesDrawer = bodiesDrawer

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
            else if(player.gun == Guns.VULCAN_MISSILE) this.bullets.push(new VulcanMissile({ x: player.position.x, y: player.position.y }))
            else this.bullets.push(new HarpoonBody({ x: player.position.x, y: player.position.y }))
        })

        this.sideMenu = new SideMenu(
            'test',
            {
                lives: 0,
                clockTimeLeft: this.clockTimeLeft,
                hourglassTimeLeft: this.hourglassTimeLeft,
                gun: this.players[0].gun,
                forceFields: this.players[0].forceFields,
                forceFieldTimeLeft: this.players[0].forceFieldsTimeLeft,
            }
        )
        this.sideMenu.position.set(GAME_SIZE.x, 0)
        container.addChild(this.sideMenu)

        this.draw()
    }

    /**
     * Rozpoczyna grę.
     * Zmienia stan gry, oblicza czas na odświeżenie gry i uruchamia pętlę gry.
     * 
     * @param graphics - Obiekt pozwalający na rysowanie kształtów
     * @param FPS - Oczekiwana ilość odświeżeń i klatek na sekundę
     */
    start(FPS: number = 30) {
        const frameTime = 1000 / FPS

        this.state = GameState.RUNNING
        
        this.time = 0

        setInterval(() => {
            if(this.state == GameState.RUNNING) {
                this.time += frameTime / 1000

                this.update(frameTime / 1000)
                this.draw()
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
        // Odświeża pozycję pocisków.
        this.bullets.forEach(bullet => bullet.update(delta))

        // Usuwa platformy, które można zniszczyć, które zostały trafione pociskami.
        const newPlatforms = this.platforms.filter(platform => platform.isBreakable? !this.bullets.some(bullet => bullet.isColliding(platform)): true)
        this.bullets = this.bullets.filter(bullet => !this.platforms.some(platform => platform.isBreakable? platform.isColliding(bullet): false))
        this.platforms = newPlatforms

        // Jeśli ociski trafiły w przeszkodę, cofa je.
        this.bullets.forEach(bullet => bullet.update(0, [ this.borders[0] ].concat(this.platforms)))

        // Trzyma nowe piłki, które zostaną dodane do gry.
        const ballsToAdd: Array<BallBody> = [  ]
        // Dzieli piłki.
        const splitBall = (ball: BallBody) => {
            const newSize = ball.radius > BallSize.MEDIUM? ball.radius > BallSize.BIG? BallSize.BIG: BallSize.MEDIUM: ball.radius > BallSize.SMALL? BallSize.SMALL: 0

            ball.radius = 0
            ballsToAdd.push(
                new BallBody({ x: ball.position.x + 10, y: ball.position.y }, newSize, { x: (ball.speed.x > 0? ball.speed.x: -ball.speed.x) + 50, y: ball.speed.y }),
                new BallBody({ x: ball.position.x - 10, y: ball.position.y }, newSize, { x: (ball.speed.x > 0? -ball.speed.x: ball.speed.x) - 50, y: ball.speed.y })
            )

            // this.bodiesDrawer.addBalls(this.container, [ ballsToAdd[0] ])
        }

        // Sprawdza czy bonus, dynamit, został podniesiony i rozbija piłki.
        if(this.dynamiteSplits > 0 && this.splitCooldown <= 0) {
            this.balls.forEach(ball => { if(ball.radius > BallSize.SMALL) splitBall(ball) })

            this.dynamiteSplits --
            this.splitCooldown = 1
        }
        
        // Dzielni piłki trafione przez pociski.
        this.balls.forEach(ball => {
            const preSize = this.bullets.length
            this.bullets = this.bullets.filter(body => !(body instanceof BulletBody) || !ball.isColliding(body))

            if(this.bullets.length < preSize) splitBall(ball)
        })
        this.balls = this.balls.filter(ball => ball.radius > 0)
        this.balls.push(... ballsToAdd)
        
        // Odświeża pozycję piłek, zatrzymuje lub spowalnia je jeśli jest aktywny bonus zegar lub klepsydra.
        this.balls.forEach(ball => ball.update(this.clockTimeLeft > 0? 0: this.hourglassTimeLeft > 0? delta / 3: delta, this.borders.concat(this.platforms)))

        // Sprawdza czy gracz został trafiony przez piłkę, kończy grę jeśli gracz nie ma aktywnego bonusu tarczy.
        // Aktywyje nowe, podniesione bonusy.
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

        // Usuwa pociski które trafiły jakiś obiekt.
        this.bullets = this.bullets.filter(bullet => bullet instanceof PowerWireBody? bullet.timeLeft > 0: bullet.speed.y < 0)

        // Usuwa bonusy które zostały podniesione.
        this.powerUps = this.powerUps.filter(powerUp => powerUp.timeLeft > 0)
        this.powerUps.forEach(powerUp => powerUp.update(delta, [ this.borders[1] ].concat(this.platforms)))

        // Zwiększa czas który bonusy są już na planszy.
        if(this.hourglassTimeLeft > 0) this.hourglassTimeLeft -= delta
        else this.hourglassTimeLeft = 0
        if(this.clockTimeLeft > 0) this.clockTimeLeft -= delta
        else this.clockTimeLeft = 0
        if(this.splitCooldown > 0) this.splitCooldown -= delta
        else this.splitCooldown = 0
    }

    /**
     * Wyświetla grę i statystyki.
     */
    draw() {
        this.bodiesDrawer.update(
            this.container,
            {
                players: this.players,
                balls: this.balls,
                bullets: this.bullets,
                powerUps: this.powerUps,
                platforms: this.platforms,
                ladders: this.ladders
            } as Level
        )

        this.sideMenu.updateInfo(
            {
                time: this.time,
                lives: 0,
                clockTimeLeft: this.clockTimeLeft,
                hourglassTimeLeft: this.hourglassTimeLeft,
                gun: this.players[0].gun,
                forceFields: this.players[0].forceFields,
                forceFieldTimeLeft: this.players[0].forceFieldsTimeLeft,
            }
        )
    }
}