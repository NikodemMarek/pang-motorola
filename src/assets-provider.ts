import { Loader } from 'pixi.js'
import sets from '../static/images/sets.json'
import { BasePath } from './const'

/**
 * Zwraca listę dostępnych zestawów grafik.
 * 
 * @returns lista dostępnych zestawów grafik
 */
export const getImagesSetsList = () => sets

/**
 * Klasa ułatwiająca wczytwanie i zarządzanie spritesheetami do gry.
 */
export class ImagesProvider {
    /**
     * Obieket tej klasy który służy jako singleton.
     */
    private static _instance: ImagesProvider

    /**
     * Ścieżka do spritesheetu z wczytanym zestawem grafik.
     */
    public path?: string = undefined

    /**
     * Ładuje zestaw jeśli nazwa zestawu została podana.
     * 
     * @param name - Nazwa zestawu do wczytania
     */
    private constructor(setNumber?: number) {
        if(setNumber != undefined) this.loadSet(setNumber)
    }
    /**
     * Jeśli obiekt w _instance nie istnieje to tworzy go używając konstruktora.
     * Zwraca stały obiekt tej klasy, niezależnie od miejsca wywołania.
     * 
     * @param name - Nazwa zestawu do wczytania
     * @returns Stały obiekt tej klasy
     */
    public static Instance(setNumber?: number) {
        return this._instance || (this._instance = new this(setNumber))
    }

    /**
     * Wczytuje mapę spritesheetu i zapisuje ją do zmiennej set.
     * Funkcja wczytuje plik map.json dla spritesheetu.
     * Jeśli spritesheet został wczytany zwraca true, jeśli nie false.
     * 
     * @param setNumber - Numer zestawu do wczytania w kolejność zgodnej z {@link sets}
     * @returns True - spritesheet wczytany, false - wczytywanie się nie powiodło
     */
    public loadSet(setNumber: number): boolean {
        const setData = sets[setNumber]

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
    public getTexture(name: string) { return this.path == undefined? undefined: Loader.shared.resources[this.path].textures!![name] }
    /**
     * Zwraca animację, do objektu AnimatedSprite.
     * 
     * @param name - Nazwa animacji
     * @returns Animacja lub undefined, jeżeli nie istnieje podana animacja
     */
    public getAnimation(name: string) { return this.path == undefined? undefined: Loader.shared.resources[this.path].spritesheet!!.animations[name] }
}

/**
 * Zwraca dźwięk wczytany do gy.
 * 
 * @param name - Nazwa dźwięku
 * @returns Dźwięk
 */
export const getSound = (name: string) => Loader.shared.resources[name].sound