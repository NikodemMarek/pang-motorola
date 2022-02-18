import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, getLevelsList, loadLevel, readGame, savedGamesList } from './levels-provider'
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

const mainMenu = () => scenes.start('main-menu')

const addGame = async (level: { level: Level, info: any }, levelName: string) => {
    scenes.remove('game')

    const gameScene = new GameScene(mainMenu)
    gameScene.setLevel(level.level, level.info, levelName)
    scenes.add('game', gameScene)
}

const scenes = new ScenesNavigator(app)
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

    const refreshCampaignLevelsScene = () => {
        scenes.remove('campaign-levels')

        const campaignLevelsScene = new LevelsMenuScene(
            getLevelsList('campaign').map(levelData => levelData.name),
            async levelName => {
                await addGame(await loadGameLevel('campaign', levelName), levelName)
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
                await addGame(await loadGameLevel('bonus', levelName), levelName)
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
                await addGame(getLevel(readGame('campaign', gameName)), gameName)
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
                await addGame(getLevel(readGame('bonus', gameName)), gameName)
                scenes.start('game')
            },
            () => { scenes.pop() }
        )

        scenes.add('bonus-saved', savedBonusGamesScene)
    }

    scenes.add('main-menu', mainMenuScene)

    scenes.add('options-menu', optionsMenuScene)
    scenes.add('level-choice', levelChoiceScene)

    refreshCampaignLevelsScene()
    refreshBonusLevelsScene()

    refreshCampaignSavedGamesScene()
    refreshBonusSavedGamesScene()
}

init().finally(mainMenu)