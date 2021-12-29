import { AnimatedSprite, Application } from 'pixi.js'
import { ImagesProvider } from './assets-provider'
import Loading from './views/loading'

/**
 * Tworzy aplikację we wskazanym kontenerze i określa dodatkowe parametry aplikacji.
 */
const app = new Application({
    view: document.getElementById('pixi-canvas') as HTMLCanvasElement,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0xf0f0f0,
    width: 800,
    height: 500
})

/**
 * Wczytuje domyślny zestaw zasobów.
 */
const imagesProvider: ImagesProvider = ImagesProvider.Instance('programmer-art')

/**
 * Pokazuje postęp ładowania domyślnego zestawu zasobów.
 */
const assetsLoader: Loading = new Loading([ { path: imagesProvider.path!! } ], onComplete, '')
assetsLoader.position.set(app.view.width / 2, app.view.height / 2)
app.stage.addChild(assetsLoader)

/**
 * Funkcja która zostanie wykonana po załadowaniu zasobów.
 */
function onComplete() {
    const loading = new AnimatedSprite(imagesProvider.getAnimation(ImagesProvider.animation.LOADING)!!)
    loading.animationSpeed = 0.2; 
    loading.play()
    app.stage.addChild(loading)
}