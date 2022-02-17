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
 * @returns Poziom w postaci {@link Level}, oraz informacje o rozgrywce
 */
export const getLevel = (rawLevel: any): { level: Level, info: any } => {
    return {
        level: {
            players: (rawLevel.players as Array<PlayerBody>).map(player => {
                const newPlayer = new PlayerBody(player.position)
                newPlayer.lives = player.lives
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
                const newBullet = bullet.gun == 2? new VulcanMissile(bullet.position): bullet.gun == 1? new PowerWireBody(bullet.position): new HarpoonBody(bullet.position)
                newBullet.position = bullet.position

                return newBullet
            }),
            platforms: (rawLevel.platforms as Array<PlatformBody>).map(platform => new PlatformBody(platform.position, platform.size, platform.isBreakable)),
            ladders: (rawLevel.ladders as Array<LadderBody>).map(ladder => new LadderBody(ladder.position, ladder.size.y)),
            powerUps: (rawLevel.powerUps as Array<PowerUpBody>).map(powerUp => {
                const newPowerUp = new PowerUpBody(powerUp.position, powerUp.type)
                newPowerUp.timeLeft = powerUp.timeLeft

                return newPowerUp
            }),
            points: (rawLevel.points as Array<PointBody>).map(point => new PointBody(point.position, point.value))
        } as Level,
        info: {
            time: rawLevel.info.time,
            score: rawLevel.info.score,
            clockTimeLeft: rawLevel.info.clockTimeLeft,
            hourglassTimeLeft: rawLevel.info.hourglassTimeLeft
        }
    }
}

/**
 * Konwertuje poziom z gry na jego surową formę.
 * Zmniejsza ilość danych potrzebnych do zapisania stanu poziomu.
 * 
 * @param level - Informacje o stanie obiektów w grze
 * @param info - Ogólne informacje o poziomie
 * @returns Poziom w surowej formie
 */
export const rawLevel = (level: Level, info: any) => {
    const players = level.players.map(player => {
        return {
            accelerators: player.accelerators,
            position: player.position,
            lives: player.lives,
            shotTwoTimes: player.shotTwoTimes,
            forceFields: player.forceFields,
            forceFieldsTimeLeft: player.forceFieldsTimeLeft,
            gun: player.gun,
            cooldown: player.cooldown
        }
    })
    const balls = level.balls.map(ball => {
        return {
            speed: ball.speed,
            position: ball.position,
            radius: ball.radius,
            isFalling: ball.isFalling,
            lastHeight: ball.lastHeight
        }
    })
    const bullets = level.bullets.map(bullet => {
        return {
            position: bullet.position,
            size: bullet.size,
            gun: bullet instanceof VulcanMissile? 2: bullet instanceof PowerWireBody? 1: 0
        }
    })
    const powerUps = level.powerUps.map(powerUp => {
        return {
            position: powerUp.position,
            timeLeft: powerUp.timeLeft,
            type: powerUp.type
        }
    })
    const points = level.points.map(point => {
        return {
            position: point.position,
            value: point.value,
        }
    })

    const platforms = level.platforms.map(platform => {
        return {
            position: platform.position,
            size: platform.size,
            isBreakable: platform.isBreakable
        }
    })
    const ladders = level.ladders.map(ladder => {
        return {
            position: ladder.position,
            size: ladder.size
        }
    })

    return {
        players: players,
        balls: balls,
        bullets: bullets,
        powerUps: powerUps,
        points: points,
        platforms: platforms,
        ladders: ladders,
        info: info
    } 
}

/**
 * Zwraca listę gier zapisanych w local storage.
 * 
 * @returns Lista kluczy do zapisanych gier
 */
export const savedGamesList = (): Array<string> => [ ... Array(window.localStorage.length).keys() ].map(key => window.localStorage.key(key) || '')
/**
 * Zapisuje stan rozgrywki do local sotrage pod kluczem / nazwą zapisu.
 * 
 * @param saveName - Klucz i nazwa pod którym będzie zapisana rozgrywka
 * @param rawLevel - Stan rozgrywki zapisany w surowej formie, jak z {@link rawLevel}
 */
export const saveGame = (saveName: string, rawLevel: any) => { window.localStorage.setItem(saveName, JSON.stringify(rawLevel)) }
/**
 * Wczytuje poziom z local storage.
 * 
 * @param saveName - Klucz i nazwa pod którym jest zapisana rozgrywka
 * @returns Poziom w surowej postaci
 */
export const readGame = (saveName: string) => JSON.parse(window.localStorage.getItem(saveName) || '')
/**
 * Usuwa zapisaną grę z local sotrage.
 * 
 * @param saveName - Klucz i nazwa pod którym jest zapisana rozgrywka
 */
export const removeGame = (saveName: string) => { window.localStorage.removeItem(saveName) }