import { BitmapFont, BitmapText, Container, Loader } from 'pixi.js'

/**
 * Container z procentowym postępem w ładowaniu zasobów.
 */
export default class Loading extends Container {
    /**
     * Dodaje zasoby do załadowania, do Loadera.
     * Wyświetla procentowy postęp wczytywania.
     * Wczytuje dodane zasoby.
     * Wczytuje pozostałe zasoby do gry.
     * 
     * @param resources - Mapa zestawu zasobów do wczytania
     * @param onComplete - Funkcja która wykona się po wczytaniu zasobów
     * @param baseUrl - Scieżka do folderu z zasobami
     * @param loadOther - Funkcja która wczyta inne zasoby niż grafiki
     */
    constructor(
        resources: Array<{ path: string, name?: string }>,
        onComplete: () => void,
        baseUrl = './images',
        loadOther?: () => Promise<void>
    ) {
        super()

        const loader = Loader.shared

        loader.baseUrl = baseUrl
        resources.forEach((resource) => {
            if(resource.name == undefined) loader.add(resource.path)
            else loader.add(resource.name, resource.path)
        })
        
        loader.onProgress.add(() => progressValue.text = loader.progress.toFixed(0))
        loader.onComplete.once(() => {
            if(loadOther != undefined) loadOther().finally(onComplete)
            else onComplete()
            
            this.parent.removeChild(this)
            this.destroy({ children: true, texture: true, baseTexture: true })
        })
        loader.load()
        
        BitmapFont.from('progressValueFont', {
            fill: 0x000000,
            fontFamily: 'Noto Sans',
            fontSize: 40
        })
        
        const progressValue: BitmapText = new BitmapText('0', { fontName: 'progressValueFont' })
        progressValue.anchor.set(0.5, 0.5)
        this.addChild(progressValue)
    }
}