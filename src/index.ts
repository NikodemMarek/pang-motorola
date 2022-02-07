import { Application, Graphics } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { GAME_SIZE, ImagePath } from './const'
import Game from './game/game'
import { getLevel, loadLevel } from './levels-provider'
import { Level } from './types'
import Loading from './views/loading'
import Menu from './views/menu'

/**
 * Tworzy aplikację we wskazanym kontenerze i określa dodatkowe parametry aplikacji.
 */
const app = new Application({
    view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0xf0f0f0,
    width: GAME_SIZE.x,
    height: GAME_SIZE.y
})

const _this = app.stage

/**
 * Wczytuje domyślny zestaw zasobów.
 */
const imagesProvider: ImagesProvider = ImagesProvider.Instance(0)

/**
 * Wczytany poziom.
 */
let level: Level

/**
 * Pokazuje postęp ładowania domyślnego zestawu zasobów.
 */
const assetsLoader: Loading = new Loading([ { path: imagesProvider.path!! } ], onComplete, '', async () => { level = getLevel(await loadLevel('test')) })
assetsLoader.position.set(app.view.width / 2, app.view.height / 2)
_this.addChild(assetsLoader)

/**
 * Funkcja która zostanie wykonana po załadowaniu zasobów.
 * Wyświetla główne menu gry.
 */
async function onComplete() {
    const menu = new Menu(
        [
            {
                onClick: () => dummyGame(),
                properties: {
                    label: 'Play',
                }
            },
            {
                onClick: () => console.log('options'),
                properties: {
                    label: 'Options',
                }
            },
            {
                onClick: () => console.log('exit'),
                properties: {
                    label: 'Exit',
                }
            }
        ],
        {
            width: 200,
            height: 50,
            texture: imagesProvider.getTexture(ImagePath.MENU_BUTTON),
            hoverTexture: imagesProvider.getTexture(ImagePath.MENU_BUTTON_HOVER),
            labelColor: 0x407ff9,
            labelHoverColor: 0xff7ff9
        },
        false
    )
    menu.position.set(app.view.width / 2, app.view.height / 2)
    _this.addChild(menu)
}

///////////////////////////////////////////////////////
// Tymczasowa prosta gra.
// TODO: Remove this.
function dummyGame() {
    const graphics = new Graphics()

    _this.addChild(graphics)

    _this.interactive = true

    const game = new Game(_this, level)
    game.start(graphics, 60)
}