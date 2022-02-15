import { SceneManager } from 'pixi-scenes'
import { Application, BitmapFont, Loader } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { RENDERER_SIZE } from './const'
import { getLevel, loadLevel } from './levels-provider'
import GameScene from './views/scenes/game-scene'
import MainMenuScene from './views/scenes/main-menu-scene'
import OptionsMenuScene from './views/scenes/options-menu-scene'

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
const loadGameLevel = async (level: string) => getLevel(await loadLevel(level))

const mainMenu = () => { scenes.start('main-menu') }

const addGame = async (levelName: string) => {
    scenes.remove('game')

    const gameScene = new GameScene(() => scenes.start('main-menu'))
    gameScene.setLevel((await loadGameLevel(levelName)).level, 'how you doin')
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

    const mainMenuScene = new MainMenuScene(async (option) => {
        switch(option) {
            case 0:
            case 1:
            case 2:
                await addGame('test')
                scenes.start('game')
            break
            case 3:
                scenes.start('options-menu')
            break
        }
    })
    const optionsMenuScene = new OptionsMenuScene(init, () => scenes.start('main-menu'))

    scenes.add('main-menu', mainMenuScene)
    scenes.add('options-menu', optionsMenuScene)
}

init().finally(mainMenu)