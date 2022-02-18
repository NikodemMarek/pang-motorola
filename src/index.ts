import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, getLevelsList, loadLevel, rawLevel, readGame, removeGame, savedGamesList, saveGame } from './levels-provider'
import { Level } from './types'
import GameScene from './views/scenes/game-scene'
import LevelChoiceScene from './views/scenes/level-choice-scene'
import LevelsMenuScene from './views/scenes/levels-menu-scene'
import MainMenuScene from './views/scenes/main-menu-scene'
import OptionsMenuScene from './views/scenes/options-menu-scene'
import { ScenesNavigator } from './views/scenes/scenes-navigator'

/**
 * Tworzy aplikację we wskazanym kontenerze i określa dodatkowe parametry aplikacji.
 */
const app = new Application({
    view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0xf0f0f0,
    width: RENDERER_SIZE.x,
    height: RENDERER_SIZE.y
})

const loadAssets = async (set: number) => {
    const provider = ImagesProvider.Instance()
    provider.loadSet(set)

    return new Promise((resolve, reject) => {
        const loader = Loader.shared
        loader.add(provider.path!)
        loader.load()

        loader.onComplete.once(() => resolve(true))
        loader.onError.once(() => reject(false))
    })
}
const loadGameLevel = async (mode: string, levelName: string) => getLevel(await loadLevel(mode, levelName))

const addGame = async (level: { level: Level, info: any }, levelName: string, saveTo?: string) => {
    scenes.remove('game')

    const gameScene = new GameScene(
        () => { scenes.pop() },
        saveTo != undefined? game => {
            scenes.remove('save-game')

            const labels = [ 'Julka', 'Zuzia', 'Iza', 'Nikodem', 'Krzysiu', 'Motorola' ].map(label => label + (!savedGamesList(saveTo).some(save => save == label)? ' empty': ''))
    
            const saveGamesScene = new LevelsMenuScene(
                labels,
                async saveName => {
                    removeGame(saveTo, saveName)
                    saveGame(saveTo, saveName.replace(' empty', ''), rawLevel(
                        {
                            players: game.players,
                            balls: game.balls,
                            bullets: game.bullets,
                            powerUps: game.powerUps,
                            points: game.points,
                            platforms: game.platforms,
                            ladders: game.ladders
                        } as Level,
                        {
                            time: game.time,
                            score: game.score,
                            clockTimeLeft: game.clockTimeLeft,
                            hourglassTimeLeft: game.hourglassTimeLeft
                        }
                    ))

                    scenes.pop()
                },
                () => { scenes.pop() }
            )
    
            scenes.add('save-game', saveGamesScene)
            scenes.start('save-game')
        }: undefined,
        saveTo != undefined && saveTo == 'campaign'? async () => {
            const nextLevelName = getLevelsList('campaign')[parseInt(levelName.slice(0, 2))].name
            
            addGame(await loadGameLevel('campaign', nextLevelName), nextLevelName, 'campaign')
            scenes.start('game')
        }: undefined
    )
    gameScene.setLevel(level.level, level.info, levelName)
    scenes.add('game', gameScene)
    gameScene.startGame()
}

const scenes = new ScenesNavigator(app)

const refreshCampaignLevelsScene = () => {
    scenes.remove('campaign-levels')

    const campaignLevelsScene = new LevelsMenuScene(
        getLevelsList('campaign').map(levelData => levelData.name),
        async levelName => {
            await addGame(await loadGameLevel('campaign', levelName), levelName, 'campaign')
            scenes.start('game')
        },
        () => { scenes.pop() },
        savedGamesList('campaign').length > 0? () => {
            refreshCampaignSavedGamesScene()
            scenes.start('campaign-saved')
        }: undefined
    )

    scenes.add('campaign-levels', campaignLevelsScene)
}
const refreshBonusLevelsScene = () => {
    scenes.remove('bonus-levels')

    const bonusLevelsScene = new LevelsMenuScene(
        getLevelsList('bonus').map(levelData => levelData.name),
        async levelName => {
            await addGame(await loadGameLevel('bonus', levelName), levelName, 'bonus')
            scenes.start('game')
        },
        () => { scenes.pop() },
        savedGamesList('bonus').length > 0? () => {
            refreshBonusSavedGamesScene()
            scenes.start('bonus-saved')
        }: undefined
    )

    scenes.add('bonus-levels', bonusLevelsScene)
}
const refreshCampaignSavedGamesScene = () => {
    scenes.remove('campaign-saved')

    const savedCampaignGamesScene = new LevelsMenuScene(
        savedGamesList('campaign'),
        async gameName => {
            await addGame(getLevel(readGame('campaign', gameName)), gameName, 'campaign')
            scenes.start('game')
        },
        () => { scenes.pop() }
    )

    scenes.add('campaign-saved', savedCampaignGamesScene)
}
const refreshBonusSavedGamesScene = () => {
    scenes.remove('bonus-saved')

    const savedBonusGamesScene = new LevelsMenuScene(
        savedGamesList('bonus'),
        async gameName => {
            await addGame(getLevel(readGame('bonus', gameName)), gameName, 'bonus')
            scenes.start('game')
        },
        () => { scenes.pop() }
    )

    scenes.add('bonus-saved', savedBonusGamesScene)
}

const init = async () => {
    BitmapFont.from('buttonLabelFont', {
        fontFamily: 'Noto Sans',
        fill: 0xffffff,
        fontSize: 30
    })
    await loadAssets(0)

    const mainMenuScene = new MainMenuScene(async option => {
        switch(option) {
            case 0:
                scenes.start('level-choice')
            break
            case 1:
                refreshCampaignLevelsScene()
                scenes.start('campaign-levels')
            break
            case 2:
                refreshBonusLevelsScene()
                scenes.start('bonus-levels')
            break
            case 3:
                scenes.start('options-menu')
            break
        }
    })
    const optionsMenuScene = new OptionsMenuScene(init, () => { scenes.pop() })

    const levelChoiceScene = new LevelChoiceScene(
        async (difficulty: string, levelName: string) => {
            await addGame(await loadGameLevel(difficulty, levelName), levelName)
            scenes.start('game')
        },
        () => { scenes.pop() }
    )

    scenes.add('main-menu', mainMenuScene)

    scenes.add('options-menu', optionsMenuScene)
    scenes.add('level-choice', levelChoiceScene)

    refreshCampaignLevelsScene()
    refreshBonusLevelsScene()

    refreshCampaignSavedGamesScene()
    refreshBonusSavedGamesScene()
}

init().finally(() => scenes.start('main-menu'))