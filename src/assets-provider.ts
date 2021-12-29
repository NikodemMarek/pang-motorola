import { Loader } from 'pixi.js'
import sets from '../static/images/sets.json'

/**
 * Zwraca listę dostępnych zestawów grafik.
 * 
 * @returns lista dostępnych zestawów grafik
 */
export const getImagesSetsList = () => sets

/**
 * Bazowe ścieżki do folderów z zasobami.
 */
enum BasePath {
    IMAGES = './images/'
}

/**
 * Klasa ułatwiająca wczytwanie i zarządzanie spritesheetami do gry.
 */
export class ImagesProvider {
    /**
     * Nazwy grafik w formie enuma, dla poprawy czytelności.
     */
    public static image = {
        PINE: 'pineapple.png'
    }
    /**
     * Nazwy animacji w formie enuma, dla poprawy czytelności.
     */
    public static animation = {
        LOADING: 'lo'
    }
    
    /**
     * Obieket tej klasy który służy jako singleton.
     */
    private static _instance: ImagesProvider

    /**
     * Ścieżka do spritesheetu z wczytanym zestawem grafik.
     */
    public path: string = ''

    /**
     * Ładuje zestaw jeśli nazwa zestawu została podana.
     * 
     * @param name - Nazwa zestawu do wczytania
     */
    private constructor(name?: string) {
        if(name != undefined) this.loadSet(name)
    }
    /**
     * Jeśli obiekt w _instance nie istnieje to tworzy go używając konstruktora.
     * Zwraca stały obiekt tej klasy, niezależnie od miejsca wywołania.
     * 
     * @param name - Nazwa zestawu do wczytania
     * @returns Stały obiekt tej klasy
     */
    public static Instance(name?: string) {
        return this._instance || (this._instance = new this(name))
    }

    /**
     * Wczytuje mapę spritesheetu i zapisuje ją do zmiennej set.
     * Funkcja wczytuje plik map.json dla spritesheetu.
     * Jeśli spritesheet został wczytany zwraca true, jeśli nie false.
     * 
     * @param name - Nazwa zestawu do wczytania
     * @returns True - spritesheet wczytany, false - wczytywanie się nie powiodło
     */
    public loadSet(name: string): boolean {
        const setData = Object(sets)[name]

        if(setData != undefined) {
            this.path = `${BasePath.IMAGES}${setData.path}map.json`

            return true
        } else return false
    }

    /**
     * Zwraca teksrurę dla grafiki, do objektu Sprite.
     * 
     * @param name - Nazwa grafiki
     * @returns Tesktura lub undefined, jeżeli nie istnieje tekstura dla podanej grafiki
     */
    public getTexture(name: string) { return Loader.shared.resources[this.path].textures!![name] }
    /**
     * Zwraca animację, do objektu AnimatedSprite.
     * 
     * @param name - Nazwa animacji
     * @returns Animacja lub undefined, jeżeli nie istnieje podana animacja
     */
    public getAnimation(name: string) { return Loader.shared.resources[this.path].spritesheet!!.animations[name] }
}