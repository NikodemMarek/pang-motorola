import { Application, BitmapFont } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { ImagePath, RENDERER_SIZE } from './const'
import BodiesDrawer from './game/bodies-drawer'
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
    width: RENDERER_SIZE.x,
    height: RENDERER_SIZE.y
})

const _this = app.stage

/**
 * Wczytuje domyślny zestaw zasobów.
 */
const imagesProvider: ImagesProvider = ImagesProvider.Instance(1)

/**
 * Wczytany poziom.
 */
let level: Level

/**
 * Pokazuje postęp ładowania domyślnego zestawu zasobów.
 */
const assetsLoader: Loading = new Loading([ { path: imagesProvider.path!! } ], onComplete, '', async () => {
    level = getLevel(await loadLevel('test')).level

    BitmapFont.from('buttonLabelFont', {
        fontFamily: 'Noto Sans',
        fill: 0xffffff,
        fontSize: 30
    })
})
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
            size: { x: 200, y: 50 },
            texture: imagesProvider.getTexture(ImagePath.MENU_BUTTON),
            hoverTexture: imagesProvider.getTexture(ImagePath.MENU_BUTTON_HOVER),
            labelColor: 0x407ff9,
            labelHoverColor: 0xff7ff9
        },
        false
    )
    menu.position.set(RENDERER_SIZE.x / 2, RENDERER_SIZE.y / 2)
    _this.addChild(menu)
}

///////////////////////////////////////////////////////
// Tymczasowa prosta gra.
// TODO: Remove this.
function dummyGame() {
    _this.sortableChildren = true

    const drawer = new BodiesDrawer()
    drawer.setLevel(_this, level)

    const game = new Game(_this, drawer, level)
    game.start(60)
}