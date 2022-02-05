import levels from '../static/levels/levels.json'
import { BasePath, Guns, Keymap, PLAYER_SIZE } from './const'
import { BallBody, LadderBody, PlatformBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { BulletBody, PowerWireBody } from './game/physics/weapons'
import { Level, XYVar } from './types'

/**
 * Pobiera listę domyślnych poziomów do gry.
 * 
 * @returns Tablica obiektów z nazwami i ścieżkami do plików
 */
export const getLevelsList = () => levels

/**
 * Wczytuje plik JSON z posiomem i zwraca go jako Promise.
 * 
 * @param name - Nazwa poziomu do wczytania
 * @returns Promise z poziomem w surowej formie
 */
export const loadLevel = async (name: string): Promise<Object | undefined> => {
    const levelData = levels.find((level) => level.name == name)

    if(levelData != undefined) return await fetch(`${BasePath.LEVELS}${levelData.path}`).then(response => response.json())
    else return undefined
}

export const getLevel = (rawLevel: any): Level => {
    const players: Array<PlayerBody> = (rawLevel.players as Array<Array<any>>).map(player => new PlayerBody(
        (player[0] as XYVar),
        PLAYER_SIZE,
        Keymap,
        player[1] != undefined && player[1].gun != undefined? player[1].gun: Guns.HARPOON,
    ))

    const platforms: Array<PlatformBody> = (rawLevel.platforms as Array<Array<any>>).map(platform => new PlatformBody(
        (platform[0] as XYVar),
        (platform[1] as XYVar),
        platform[2]
    ))

    const ladders: Array<LadderBody> = (rawLevel.ladders as Array<Array<any>>).map(ladder => new LadderBody(
        (ladder[0] as XYVar),
        (ladder[1] as XYVar)
    ))

    const balls: Array<BallBody> = (rawLevel.balls as Array<Array<any>>).map(ball => new BallBody(
        (ball[0] as XYVar),
        ball[1]
    ))

    const bullets: Array<BulletBody> = (rawLevel.balls as Array<Array<any>>).map(bullet => new BulletBody(bullet[0])).concat((rawLevel.powerWires as Array<Array<any>>).map(bullet => new PowerWireBody(bullet[0])))

    const powerUps: Array<PowerUpBody> = (rawLevel.powerUps as Array<Array<any>>).map(powerUp => new PowerUpBody(powerUp[0], powerUp[1]))

    return {
        players: players,
        platforms: platforms,
        ladders: ladders,
        balls: balls,
        bullets: bullets,
        powerUps: powerUps
    }
}