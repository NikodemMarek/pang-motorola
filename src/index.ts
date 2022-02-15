import clone from 'clone'
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

const scenes = new SceneManager(app)
const init = async () => {
    BitmapFont.from('buttonLabelFont', {
        fontFamily: 'Noto Sans',
        fill: 0xffffff,
        fontSize: 30
    })
    await loadAssets(0)
    const level = await loadGameLevel('test')

    const mainMenuScene = new MainMenuScene(option => {
        switch(option) {
            case 0:
                scenes.start('game')
            break
            case 1:
                scenes.start('options-menu')
            break
        }
    })
    const optionsMenuScene = new OptionsMenuScene(init, () => scenes.start('main-menu'))

    scenes.add('main-menu', mainMenuScene)
    scenes.add('options-menu', optionsMenuScene)

    const resetGame = () => {
        scenes.remove('game')

        const gameScene = new GameScene(() => {
            resetGame()
            scenes.start('main-menu')
        })
        gameScene.setLevel(clone(level.level), 'how you doin')
        scenes.add('game', gameScene)
    }
    resetGame()
}

init().finally(mainMenu)