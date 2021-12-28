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
     * Ścieżka do spritesheetu z wczytanym zestawem grafik.
     */
    path: string = ''
    /**
     * Nazwy grafik w formie enuma, dla poprawy czytelności.
     */
    image = {
        PINE: 'pineapple.png'
    }
    /**
     * Nazwy animacji w formie enuma, dla poprawy czytelności.
     */
    animation = {
        LOADING: 'lo'
    }

    constructor(name?: string) {
        if(name != undefined) this.loadSet(name)
    }

    /**
     * Wczytuje mapę spritesheetu i zapisuje ją do zmiennej set.
     * Funkcja wczytuje plik map.json dla spritesheetu.
     * Jeśli spritesheet został wczytany zwraca true, jeśli nie false.
     * 
     * @param name - Nazwa spritesheetu
     * @returns True - spritesheet wczytany, false - wczytywanie się nie powiodło
     */
    loadSet(name: string): boolean {
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
    getTexture(name: string) { return Loader.shared.resources[this.path].textures!![name] }
    /**
     * Zwraca animację, do objektu AnimatedSprite.
     * 
     * @param name - Nazwa animacji
     * @returns Animacja lub undefined, jeżeli nie istnieje podana animacja
     */
    getAnimation(name: string) { return Loader.shared.resources[this.path].spritesheet!!.animations[name] }
}