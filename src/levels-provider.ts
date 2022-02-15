import levels from '../static/levels/levels.json'
import { BasePath } from './const'
import { HarpoonBody, PowerWireBody, VulcanMissile } from './game/physics/bullets'
import { BallBody, LadderBody, PlatformBody, PointBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { Level } from './types'

/**
 * Pobiera listę poziomów z podanego trybu.
 * 
 * @param mode - Tryb w którym dostępny jest poziom
 * @returns Tablica obiektów z nazwami i ścieżkami do poziomów
 */
export const getLevelsList = (mode: string): Array<{ name: string, path: string }> => (levels as any)[mode]

/**
 * Wczytuje i zwraca plik JSON z poziomem.
 * 
 * @param mode - Tryb w którym dostępny jest poziom
 * @param name - Nazwa poziomu do wczytania
 * @returns Poziom w surowej formie
 */
export const loadLevel = async (mode: string, name: string): Promise<Object | undefined> => {
    const levelData = getLevelsList(mode).find(level => level.name == name)

    if(levelData != undefined) return await fetch(`${BasePath.LEVELS}${levelData.path}`).then(response => response.json())
    else return undefined
}

/**
 * Konwertuje surowy poziom na {@link Level}.
 * 
 * @param rawLevel - Poziom w surowej postaci
 * @returns Poziom w postaci {@link Level}
 */
export const getLevel = (rawLevel: any): { level: Level } => {
    return {
        level: {
            players: (rawLevel.players as Array<PlayerBody>).map(player => {
                const newPlayer = new PlayerBody(player.position)
                newPlayer.shotTwoTimes = player.shotTwoTimes
                newPlayer.forceFields = player.forceFields
                newPlayer.forceFieldsTimeLeft = player.forceFieldsTimeLeft
                newPlayer.gun = player.gun
                newPlayer.cooldown = player.cooldown

                return newPlayer
            }),
            balls: (rawLevel.balls as Array<BallBody>).map(ball => {
                const newBall = new BallBody(ball.position, ball.radius)
                newBall.speed = ball.speed
                newBall.isFalling = ball.isFalling
                newBall.lastHeight = ball.lastHeight

                return newBall
            }),
            bullets: (rawLevel.bullets as Array<any>).map(bullet => {
                const newBullet = bullet.gun == 3? new VulcanMissile(bullet.position): bullet.gun == 2? new PowerWireBody(bullet.position): new HarpoonBody(bullet.position)
                newBullet.position = bullet.position

                return newBullet
            }),
            platforms: (rawLevel.platforms as Array<PlatformBody>).map(platform => new PlatformBody(platform.position, platform.size, platform.isBreakable)),
            ladders: (rawLevel.ladders as Array<LadderBody>).map(ladder => new LadderBody(ladder.position, ladder.size.y)),
            powerUps: (rawLevel.powerUps as Array<PowerUpBody>).map(powerUp => {
                const newPowerUp = new PowerUpBody(powerUp.position, powerUp.type)
                newPowerUp.speed = powerUp.speed
                newPowerUp.timeLeft = powerUp.timeLeft

                return newPowerUp
            }),
            points: (rawLevel.points as Array<PointBody>).map(point => {
                const newPoint = new PointBody(point.position, point.value)
                newPoint.speed = point.speed
    
                return newPoint
            })
        } as Level
    }
}