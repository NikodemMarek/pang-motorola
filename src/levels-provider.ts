import levels from '../static/levels/levels.json'
import { BasePath } from './const'
import { HarpoonBody, PowerWireBody, VulcanMissile } from './game/physics/bullets'
import { BallBody, LadderBody, PlatformBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { Level } from './types'

/**
 * Pobiera listę domyślnych poziomów do gry.
 * 
 * @returns Tablica obiektów z nazwami i ścieżkami do plików
 */
export const getLevelsList = () => levels

/**
 * Wczytuje plik JSON z poziomem i zwraca go jako Promise.
 * 
 * @param name - Nazwa poziomu do wczytania
 * @returns Promise z poziomem w surowej formie
 */
export const loadLevel = async (name: string): Promise<Object | undefined> => {
    const levelData = levels.find((level) => level.name == name)

    if(levelData != undefined) return await fetch(`${BasePath.LEVELS}${levelData.path}`).then(response => response.json())
    else return undefined
}

/**
 * Konwertuje surowy poziom na {@link Level}.
 * 
 * @param rawLevel - Poziom w surowej postaci
 * @returns Poziom w postaci {@link Level}
 */
export const getLevel = (rawLevel: any): Level => {
    return {
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
            newBullet.size = bullet.size

            return newBullet
        }),
        platforms: (rawLevel.platforms as Array<PlatformBody>).map(platform => new PlatformBody(platform.position, platform.size, platform.isBreakable)),
        ladders: (rawLevel.ladders as Array<LadderBody>).map(ladder => new LadderBody(ladder.position, ladder.size)),
        powerUps: (rawLevel.powerUps as Array<PowerUpBody>).map(powerUp => {
            const newPowerUp = new PowerUpBody(powerUp.position, powerUp.type)
            newPowerUp.speed = powerUp.speed
            newPowerUp.size = powerUp.size
            newPowerUp.timeLeft = powerUp.timeLeft

            return newPowerUp
        })
    } as Level
}