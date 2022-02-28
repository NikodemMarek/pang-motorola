import { AnimatedSprite, Container, Sprite, TilingSprite } from 'pixi.js'
import { ImagesProvider } from '../assets-provider'
import { AnimationPath, GAME_SIZE, ImagePath, PLAYER_SIZE, ZIndex } from '../const'
import { Level } from '../types'
import { BulletBody, PowerWireBody, VulcanMissile } from './physics/bullets'
import { BallBody, LadderBody, PlatformBody, PointBody, PortalBody } from './physics/objects'
import PlayerBody from './physics/player'
import PowerUpBody from './physics/power-ups'

/**
 * Klasa pozwalająca na wyświetlanie obiektów w grze.
 */
export default class BodiesDrawer {
    /**
     * Postacie na planszy.
     */
    private players: Array<Container> = [  ]
    /**
     * Piłki na planszy.
     */
    private balls: Array<Sprite> = [  ]
    /**
     * Pociski na planszy.
     */
    private bullets: Array<TilingSprite> = [  ]
    /**
     * Bonusy na planszy.
     */
    private powerUps: Array<Sprite> = [  ]
    /**
     * Punkty do zebrania na planszy.
     */
    private points: Array<Sprite> = [  ]

    /**
     * Platformy na planszy.
     */
    private platforms: Array<TilingSprite> = [  ]
    /**
     * Drabiny na planszy.
     */
    private ladders: Array<TilingSprite> = [  ]
    /**
     * Portale na planszy.
     */
    private portals: Array<Sprite> = [  ]

    /**
     * Usuwa wszystkie obiekty z planszy.
     * Dodaje obiekty na plansze.
     * 
     * @param container - Pojemnik w którym zostanie wyświetlona gra
     * @param level - Obiekty w poziomie
     */
    setLevel(container: Container, level: Level) {
        this.removeSprite(container, this.players.map(player => player.getChildAt(1) as Sprite), this.players.length)
        this.removeSprite(container, this.players.map(player => player.getChildAt(0) as Sprite), this.players.length)
        this.removeSprite(container, this.balls, this.balls.length)
        this.removeSprite(container, this.bullets, this.bullets.length)
        this.removeSprite(container, this.powerUps, this.powerUps.length)
        this.removeSprite(container, this.points, this.points.length)

        this.removeSprite(container, this.platforms, this.platforms.length)
        this.removeSprite(container, this.ladders, this.ladders.length)
        this.removeSprite(container, this.portals, this.portals.length)

        this.addPlayers(container, level.players)
        if(level.balls != undefined) this.addBalls(container, level.balls)
        if(level.bullets != undefined) this.addBullets(container, level.bullets)
        if(level.powerUps != undefined) this.addPowerUps(container, level.powerUps)
        if(level.points != undefined) this.addPoints(container, level.points)

        if(level.platforms != undefined) this.addPlatforms(container, level.platforms)
        if(level.ladders != undefined) this.addLadders(container, level.ladders)
        if(level.portals != undefined) this.addPortals(container, level.portals)

        this.addBackground(container)
    }

    /**
     * Usuwa Sprity z pojemnika.
     * 
     * @param container - Pojemnik z którego usunięte zostaną Sprity
     * @param sprites - Tablica z której usunięte zostaną Sprity
     * @param howMany - Ilość Spritów do usunięcia
     */
    private removeSprite(container: Container, sprites: Array<Sprite>, howMany: number) {
        sprites.slice(-howMany).forEach(sprite => container.removeChild(sprite))
        sprites.splice(sprites.length - howMany, sprites.length)
    }

    /**
     * Przesuwa obiekty w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param level - Obiekty obecnie w poziomie
     */
     update(container: Container, level: Level) {
        this.updateBalls(container, level.balls)
        this.updatePlayers(level.players)
        this.updateBullets(container, level.bullets)
        this.updatePowerUps(container, level.powerUps)
        this.updatePoints(container, level.points)
        this.updatePlatforms(container, level.platforms)
    }

    /**
     * Wyświetla postacie na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone postacie
     * @param players - Tablica z ciałami postaci
     */
    addPlayers(container: Container, players: Array<PlayerBody>) {
        this.players.push(... players.map(player => {
            const playerContainer = new Container()
            playerContainer.zIndex = ZIndex.PLAYER
            playerContainer.position.set(player.position.x, player.position.y)

            const newForceField = new Sprite(ImagesProvider.Instance().getTexture(ImagePath.FORCE_FIELD))
            newForceField.anchor.set(0.5, 0.5)
            newForceField.position.set(0, -5)
            newForceField.width = PLAYER_SIZE.x + 40
            newForceField.height = PLAYER_SIZE.y + 10
            newForceField.visible = false

            playerContainer.addChild(newForceField)

            const newPlayer = new AnimatedSprite([ ImagesProvider.Instance().getTexture(ImagePath.PLAYER)! ])
            newPlayer.anchor.set(0.5, 0.5)
            newPlayer.width = PLAYER_SIZE.x + 20
            newPlayer.height = PLAYER_SIZE.y
            newPlayer.animationSpeed = 0.1

            playerContainer.addChild(newPlayer)
            
            container.addChild(playerContainer)
            return playerContainer
        }))
    }
    /**
     * Wyświetla piłki na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone piłki
     * @param balls - Tablica z ciałami piłek
     */
    addBalls(container: Container, balls: Array<BallBody>) {
        this.balls.push(... balls.map(ball => {
            const newBall = new Sprite(ImagesProvider.Instance().getTexture(ImagePath.BALL))
            newBall.position.set(ball.position.x, ball.position.y)
            newBall.anchor.set(0.5, 0.5)
            newBall.width = ball.radius * 2
            newBall.height = ball.radius * 2

            newBall.zIndex = ZIndex.BALL

            container.addChild(newBall)
            return newBall
        }))
    }
    /**
     * Wyświetla pociski na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone pociski
     * @param bullets - Tablica z ciałami pocisków
     */
    addBullets(container: Container, bullets: Array<BulletBody>) {
        this.bullets.push(... bullets.map(bullet => {
            const newBullet = new TilingSprite(
                ImagesProvider.Instance().getTexture(bullet instanceof VulcanMissile? ImagePath.VULCAN_MISSILE: bullet instanceof PowerWireBody && bullet.speed.y == 0? ImagePath.POWER_WIRE: ImagePath.HARPOON)!,
                20, bullet.size.y
            )
            newBullet.tileScale.set(bullet.size.x / newBullet.texture.width)
            newBullet.position.set(bullet.position.x, bullet.position.y)
            newBullet.anchor.set(0.5, 0.5)

            newBullet.zIndex = ZIndex.BULLET

            container.addChild(newBullet)
            return newBullet
        }))
    }
    /**
     * Wyświetla bonusy na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone bonusy
     * @param powerUps - Tablica z ciałami bonusów
     */
    addPowerUps(container: Container, powerUps: Array<PowerUpBody>) {
        this.powerUps.push(... powerUps.map(powerUp => {
            const newPowerUp = new Sprite(ImagesProvider.Instance().getTexture(
                [
                    ImagePath.HARPOON_POWER_UP,
                    ImagePath.DOUBLE_HARPOON_POWER_UP,
                    ImagePath.POWER_WIRE_POWER_UP,
                    ImagePath.VULCAN_MISSILE_POWER_UP,
                    ImagePath.FORCE_FIELD_POWER_UP,
                    ImagePath.HOURGLASS_POWER_UP,
                    ImagePath.CLOCK_POWER_UP,
                    ImagePath.DYNAMITE_POWER_UP,
                    ImagePath.LIVE
                ][powerUp.type]
            ))
            newPowerUp.position.set(powerUp.position.x, powerUp.position.y)
            newPowerUp.anchor.set(0.5, 0.5)
            newPowerUp.width = 50
            newPowerUp.height = 50

            newPowerUp.zIndex = ZIndex.POWER_UP

            container.addChild(newPowerUp)
            return newPowerUp
        }))
    }
    /**
     * Wyświetla punkty do zebrania na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone punkty
     * @param points - Tablica z ciałami punktów
     */
    addPoints(container: Container, points: Array<PointBody>) {
        this.points.push(... points.map(point => {
            const newPoint = new Sprite(ImagesProvider.Instance().getTexture(ImagePath.POINT))
            newPoint.position.set(point.position.x, point.position.y)
            newPoint.anchor.set(0.5, 0.5)
            newPoint.width = 50
            newPoint.height = 50

            newPoint.zIndex = ZIndex.POINT

            container.addChild(newPoint)
            return newPoint
        }))
    }
    /**
     * Wyświetla platformy na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone platformy
     * @param platforms - Tablica z ciałami platform
     */
    addPlatforms(container: Container, platforms: Array<PlatformBody>) {
        this.platforms.push(... platforms.map(platform => {
            const newPlatform = new TilingSprite(
                ImagesProvider.Instance().getTexture(platform.isBreakable? ImagePath.PLATFORM_BREAKABLE: ImagePath.PLATFORM)!,
                platform.size.x, platform.size.y
            )
            newPlatform.tileScale.set(Math.min(platform.size.x / newPlatform.texture.width, platform.size.y / newPlatform.texture.height))
            newPlatform.position.set(platform.position.x, platform.position.y)
            newPlatform.anchor.set(0.5, 0.5)

            newPlatform.zIndex = ZIndex.PLATFORM

            container.addChild(newPlatform)
            return newPlatform
        }))
    }

    /**
     * Przesuwa postacie w pojemniku gry.
     * 
     * @param players - Tablica z postaciami
     */
    updatePlayers(players: Array<PlayerBody>) {
        players.forEach((player, i) => {
            if(player.forceFields > 0) this.players[i].children[0].visible = true
            else this.players[i].children[0].visible = false

            this.players[i].position.set(player.position.x, player.position.y)

            const playerSprite = this.players[i].children[1] as AnimatedSprite
            if(player.speed.y != 0 && !player.accelerators.some(acc => acc.name == 'gravity') && playerSprite.textures[0] != ImagesProvider.Instance().getTexture(AnimationPath.PLAYER_LADDER + '_01.png')) {
                playerSprite.textures = ImagesProvider.Instance().getAnimation(AnimationPath.PLAYER_LADDER)!
                playerSprite.play()
            } else if(player.speed.x > 0 && player.moves.has('RIGHT') && playerSprite.textures[0] != ImagesProvider.Instance().getTexture(AnimationPath.PLAYER_RSIDE + '_01.png')) {
                playerSprite.textures = ImagesProvider.Instance().getAnimation(AnimationPath.PLAYER_RSIDE)!
                playerSprite.play()
            } else if(player.speed.x < 0 && player.moves.has('LEFT') && playerSprite.textures[0] != ImagesProvider.Instance().getTexture(AnimationPath.PLAYER_LSIDE + '_01.png')) {
                playerSprite.textures = ImagesProvider.Instance().getAnimation(AnimationPath.PLAYER_LSIDE)!
                playerSprite.play()
            } else if(player.speed.x == 0 && !player.moves.has('DOWN') && !player.moves.has('UP')) playerSprite.textures = [ ImagesProvider.Instance().getTexture(ImagePath.PLAYER)! ]
        })
    }
    /**
     * Przesuwa piłki w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param balls - Piłki obecnie w poziomie
     */
    updateBalls(container: Container, balls: Array<BallBody>) {
        const difference = balls.length - this.balls.length

        if(difference > 0) this.addBalls(container, Array(difference).fill(new BallBody({ x: 0, y: 0 }, 0)))
        else if(difference < 0) this.removeSprite(container, this.balls, -difference)

        balls.forEach((ball, i) => {
            this.balls[i].position.set(ball.position.x, ball.position.y)
            this.balls[i].width = ball.radius * 2
            this.balls[i].height = ball.radius * 2
        })
    }
    /**
     * Przesuwa pociski w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param bullets - Pociski obecnie w poziomie
     */
    updateBullets(container: Container, bullets: Array<BulletBody>) {
        const difference = bullets.length - this.bullets.length

        if(difference > 0) this.addBullets(container, Array(difference).fill(new BulletBody({ x: 0, y: 0 })))
        else if(difference < 0) this.removeSprite(container, this.bullets, -difference)
        
        bullets.forEach((bullet, i) => {
            this.bullets[i].texture = ImagesProvider.Instance().getTexture(bullet instanceof VulcanMissile? ImagePath.VULCAN_MISSILE: bullet instanceof PowerWireBody && bullet.speed.y == 0? ImagePath.POWER_WIRE: ImagePath.HARPOON)!
            this.bullets[i].position.set(bullet.position.x, bullet.position.y)
            this.bullets[i].height = bullet.size.y
        })
    }
    /**
     * Przesuwa bonusy w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param powerUps - Bonusy obecnie w poziomie
     */
    updatePowerUps(container: Container, powerUps: Array<PowerUpBody>) {
        const difference = powerUps.length - this.powerUps.length

        if(difference > 0) this.addPowerUps(container, Array(difference).fill(new PowerUpBody({ x: 0, y: 0 }, 0)))
        else if(difference < 0) this.removeSprite(container, this.powerUps, -difference)

        if(difference != 0) powerUps.forEach((powerUp, i) => {
            this.powerUps[i].texture = ImagesProvider.Instance().getTexture(
                [
                    ImagePath.HARPOON_POWER_UP,
                    ImagePath.DOUBLE_HARPOON_POWER_UP,
                    ImagePath.POWER_WIRE_POWER_UP,
                    ImagePath.VULCAN_MISSILE_POWER_UP,
                    ImagePath.FORCE_FIELD_POWER_UP,
                    ImagePath.HOURGLASS_POWER_UP,
                    ImagePath.CLOCK_POWER_UP,
                    ImagePath.DYNAMITE_POWER_UP,
                    ImagePath.LIVE
                ][powerUp.type]
            )!
        })

        powerUps.forEach((powerUp, i) => this.powerUps[i].position.set(powerUp.position.x, powerUp.position.y))
    }
    /**
     * Przesuwa punkty do zebrania w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param points - Bonusy obecnie w poziomie
     */
    updatePoints(container: Container, points: Array<PointBody>) {
        const difference = points.length - this.points.length

        if(difference > 0) this.addPoints(container, Array(difference).fill(new PointBody({ x: 0, y: 0 }, 0)))
        else if(difference < 0) this.removeSprite(container, this.points, -difference)

        points.forEach((point, i) => this.points[i].position.set(point.position.x, point.position.y))
    }
    /**
     * Odświeża platformy w pojemniku gry.
     * 
     * @param container - Pojemnik w którym jest wyświetlana gra
     * @param platforms - Platformy obecnie w poziomie
     */
    updatePlatforms(container: Container, platforms: Array<PlatformBody>) {
        const difference = platforms.length - this.platforms.length

        if(difference > 0) this.addPlatforms(container, Array(difference).fill(new PlatformBody({ x: 0, y: 0 }, { x: 0, y: 0 })))
        else if(difference < 0) this.removeSprite(container, this.platforms, -difference)

        if(difference != 0) platforms.forEach((platform, i) => {
            this.platforms[i].texture = ImagesProvider.Instance().getTexture(platform.isBreakable ? ImagePath.PLATFORM_BREAKABLE : ImagePath.PLATFORM)!
            this.platforms[i].tileScale.set(Math.min(platform.size.x / this.platforms[i].texture.width, platform.size.y / this.platforms[i].texture.height))

            this.platforms[i].position.set(platform.position.x, platform.position.y)
            this.platforms[i].width = platform.size.x
            this.platforms[i].height = platform.size.y
        })
    }

    /**
     * Wyświetla drabiny na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone drabiny
     * @param ladders - Tablica z ciałami drabin
     */
    addLadders(container: Container, ladders: Array<LadderBody>) {
        this.ladders.push(... ladders.map(ladder => {
            const newLadder = new TilingSprite(ImagesProvider.Instance().getTexture(ImagePath.LADDER)!, PLAYER_SIZE.x + 20, ladder.size.y)
            newLadder.tileScale.set(ladder.size.x / newLadder.texture.width)
            newLadder.position.set(ladder.position.x, ladder.position.y)
            newLadder.anchor.set(0.5, 0.5)

            newLadder.zIndex = ZIndex.LADDER

            container.addChild(newLadder)
            return newLadder
        }))
    }
    /**
     * Wyświetla portale na planszy.
     * 
     * @param container - Pojemnik w którym zostaną wyświetlone portale
     * @param portals - Tablica z ciałami portali
     */
    addPortals(container: Container, portals: Array<PortalBody>) {
        this.portals.push(... portals.map(portal => {
            const newPortal = new Sprite(ImagesProvider.Instance().getTexture(ImagePath.PORTAL))
            newPortal.position.set(portal.position.x, portal.position.y)
            newPortal.anchor.set(0.5, 0.5)

            newPortal.zIndex = ZIndex.PORTAL

            container.addChild(newPortal)
            return newPortal
        }))
    }

    /**
     * Wyświetla tło na planszy.
     * 
     * @param container - Pojemnik w którym zostanie wyświetlone tło
     */
    addBackground(container: Container) {
        const background = new TilingSprite(ImagesProvider.Instance().getTexture(ImagePath.BACKGROUND)!, GAME_SIZE.x, GAME_SIZE.y + 50)
        background.tileScale.set((GAME_SIZE.y + 50) / background.texture.height)
        background.zIndex = ZIndex.BACKGROUND

        container.addChild(background)
    }
}