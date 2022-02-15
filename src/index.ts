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

const load = async (set: number) => {
    BitmapFont.from('buttonLabelFont', {
        fontFamily: 'Noto Sans',
        fill: 0xffffff,
        fontSize: 30
    })

    const provider = ImagesProvider.Instance()
    provider.loadSet(set)

    const assets = () => new Promise((resolve, reject) => {
        const loader = Loader.shared
        loader.add(provider.path!)
        loader.load()

        loader.onComplete.once(() => resolve(true))
        loader.onError.once(() => reject(false))
    })
    await assets()
    
    const level = getLevel(await loadLevel('test')).level
    return level
}

const scenes = new SceneManager(app)

const mainMenu = () => { scenes.start('main-menu') }

const init = async () => {
    const level = await load(0)

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
    const gameScene = new GameScene(() => scenes.start('main-menu'))
    gameScene.setLevel(level, 'how you doin')

    scenes.add('main-menu', mainMenuScene)
    scenes.add('options-menu', optionsMenuScene)
    scenes.add('game', gameScene)
}

init().finally(mainMenu)