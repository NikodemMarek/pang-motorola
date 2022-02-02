import { Application, Graphics } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import { BallSize, GAME_SIZE, Guns, Keymap, PowerUp } from './const'
import Game from './game/game'
import { RectangularBody } from './game/physics/bodies'
import { BallBody, LadderBody, PlatformBody } from './game/physics/objects'
import PlayerBody from './game/physics/player'
import PowerUpBody from './game/physics/power-ups'
import { BulletBody, PowerWireBody } from './game/physics/weapons'
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
const imagesProvider: ImagesProvider = ImagesProvider.Instance('programmer-art')

/**
 * Pokazuje postęp ładowania domyślnego zestawu zasobów.
 */
const assetsLoader: Loading = new Loading([ { path: imagesProvider.path!! } ], onComplete, '')
assetsLoader.position.set(app.view.width / 2, app.view.height / 2)
_this.addChild(assetsLoader)

/**
 * Funkcja która zostanie wykonana po załadowaniu zasobów.
 * Wyświetla główne menu gry.
 */
function onComplete() {
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
            texture: ImagesProvider.Instance().getTexture(ImagesProvider.image.MENU_BUTTON),
            hoverTexture: ImagesProvider.Instance().getTexture(ImagesProvider.image.MENU_BUTTON_HOVER),
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

    const game = new Game(
        _this,
        [
            new PlayerBody({ x: 100, y: 430 }, { x: 50, y: 100 }, Keymap, Guns.POWER_WIRE)
        ],
        {
            borders: [
                new RectangularBody({ x: app.view.width / 2, y: 0 }, { x: app.view.width, y: 0 }, true),
                new RectangularBody({ x: app.view.width / 2, y: app.view.height }, { x: app.view.width, y: 0 }, true),
                new RectangularBody({ x: 0, y: app.view.height / 2 }, { x: 0, y: app.view.height }, true),
                new RectangularBody({ x: app.view.width, y: app.view.height / 2 }, { x: 0, y: app.view.height }, true)
            ],
            platforms: [
                new PlatformBody({ x: 200, y: 350 }, { x: 180, y: 20 })
            ],
            ladders: [
                new LadderBody({ x: 200, y: 415 }, { x: 80, y: 150 })
            ],
            balls: [
                new BallBody({ x: 300, y: 100 }, BallSize.SMALL)
            ],
            bullets: [
                new BulletBody(250),
                new PowerWireBody(550)
            ],
            powerUps: [
                new PowerUpBody({ x: 400, y: 200 }, PowerUp.FORCE_FIELD)
            ]
        }
    )
    game.start(graphics)
    
    setTimeout(() => game.bullets.push(new BulletBody(500)), 5000)
}