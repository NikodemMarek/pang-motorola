import { SceneManager } from 'pixi-scenes'
import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, loadLevel, readGame } from './levels-provider'
import { Level } from './types'
import BonusLevelsScene from './views/scenes/bonus-levels-scene'
import CampaignLevelsScene from './views/scenes/campaign-levels-scene'
import GameScene from './views/scenes/game-scene'
import LevelChoiceScene from './views/scenes/level-choice-scene'
import MainMenuScene from './views/scenes/main-menu-scene'
import OptionsMenuScene from './views/scenes/options-menu-scene'
import SavedGamesScene from './views/scenes/saved-games-scene'

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

const scenes = new SceneManager(app)
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
                scenes.start('campaign-levels')
            break
            case 2:
                scenes.start('bonus-levels')
            break
            case 3:
                scenes.start('options-menu')
            break
        }
    })
    const optionsMenuScene = new OptionsMenuScene(init, mainMenu)

    const levelChoiceScene = new LevelChoiceScene(
        async (difficulty: string, levelName: string) => {
            await addGame(await loadGameLevel(difficulty, levelName), levelName)
            scenes.start('game')
        },
        mainMenu
    )
    const campaignLevelsScene = new CampaignLevelsScene(
        async levelName => {
        const level = await loadGameLevel('campaign', levelName)
            await addGame(level, levelName)
            scenes.start('game')
        },
        () => scenes.start('campaign-saved'),
        mainMenu
    )
    const bonusLevelsScene = new BonusLevelsScene(
        async levelName => {
            await addGame(await loadGameLevel('bonus', levelName), levelName)
            scenes.start('game')
        },
        () => scenes.start('bonus-saved'),
        mainMenu
    )

    const savedCampaignGamesScene = new SavedGamesScene(
        'campaign',
        async gameName => {
            await addGame(getLevel(readGame('campaign', gameName)), gameName)
            scenes.start('game')
        },
        mainMenu
    )
    const savedBonusGamesScene = new SavedGamesScene(
        'bonus',
        async gameName => {
            await addGame(getLevel(readGame('bonus', gameName)), gameName)
            scenes.start('game')
        },
        mainMenu
    )

    scenes.add('main-menu', mainMenuScene)
    scenes.add('options-menu', optionsMenuScene)
    scenes.add('level-choice', levelChoiceScene)
    scenes.add('campaign-levels', campaignLevelsScene)
    scenes.add('bonus-levels', bonusLevelsScene)
    scenes.add('campaign-saved', savedCampaignGamesScene)
    scenes.add('bonus-saved', savedBonusGamesScene)
}

init().finally(mainMenu)