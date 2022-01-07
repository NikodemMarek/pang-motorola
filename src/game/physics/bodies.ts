import { XYVar } from '../../types'
import { addXYvars, distanceAB, multiplyXYVar } from './utils'

/**
 * Interfejs definiujący podstawowe cechy i zachwania które musi posiadać 2 wymiarowe ciało.
 * Odpowiada za pamiętanie pozycji obiektu graficznego na ekranie, oraz za wykrywanie kolizji z innymi ciałami.
 */
export interface Body {
    /**
     * Pozycja ciała w układzie współrzędnych.
     */
    position: XYVar,
    /**
     * Prędkość z jaką przemieszcza się ciało.
     */
    speed: XYVar,
    /**
     * Przyspieszenie jakie posiada ciało.
     */
    acceleration: XYVar,
    /**
     * Wartość określająca czy ciało ma byc sprawdzane pod względem kolizji.
     */
    isCollidable: boolean,
    /**
     * Wartośc określająca czy ciało ma się odbijać.
     */
    isBouncy: boolean,
    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
    update: (delta: number, colliders?: Array<Body>) => void,
    /**
     * Sprawdza czy ciała ze sobą kolidują.
     * 
     * @param body - Ciało z którym sprawdzana jest kolizja
     * @returns Czy ciała ze sobą kolidują
     */
    isColliding: (body: Body) => boolean,
    /**
     * Przesuwa ciało o daną odległość.
     * 
     * @param by - Odległość o jaką ciało ma być przesunięte
     */
    moveBy: (by: XYVar) => void
}

/**
 * Klasa opisująca zachowanie dla {@link Body | ciała} w kształcie prostokąta.
 */
export class RectangularBody implements Body {
    /**
     * Pozycja ciała w układzie współrzędnych.
     */
    position: XYVar
    /**
     * Wymiary ciała, nie mogą być negatywne.
     */
    size: XYVar
    /**
     * Prędkość z jaką przemieszcza się ciało.
     */
    speed: XYVar = { x: 0, y: 0 }
    /**
     * Przyspieszenie jakie posiada ciało.
     */
    acceleration: XYVar = { x: 0, y: 0 }
    /**
     * Wartość określająca czy ciało ma byc sprawdzane pod względem kolizji.
     */
    isCollidable: boolean
    /**
     * Wartośc określająca czy ciało ma się odbijać.
     */
    isBouncy: boolean

    /**
     * Tworzy ciało w kształcie prostokąta, nadaje mu pozycję startową i wymiary.
     * Upewnia się że wymiary są pozytywe.
     * 
     * @param position - Pozycja startowa ciała, umieszczona w jego centrum
     * @param size - Rozmiar ciała
     */
    constructor(
        position: XYVar,
        size: XYVar,
        isCollidable: boolean = false,
        isBouncy: boolean = false
    ) {
        this.position = position
        this.size = { x: Math.abs(size.x), y: Math.abs(size.y) }

        this.isCollidable = isCollidable
        this.isBouncy = isBouncy
    }

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
    update(delta: number, colliders?: Array<Body>) {
        this.speed = addXYvars(this.speed, multiplyXYVar(this.acceleration, delta))

        if(this.isCollidable && this.isBouncy) {
            if(colliders?.some((body) => this.isColliding(body, { x: this.speed.x * delta, y: 0 }))) {
                this.speed.x *= -1
                this.acceleration.x *= -1
            }
            if(colliders?.some((body) => this.isColliding(body, { x: 0, y: this.speed.y * delta }))) {
                this.speed.y *= -1
                this.acceleration.y *= -1
            }

            this.moveBy(multiplyXYVar(this.speed, delta))
        } else this.moveBy(multiplyXYVar(this.speed, delta))
    }

    /**
     * Sprawdza czy ciała ze sobą kolidują.
     * Jeśli drugie ciało jest prostokątne, sprawdza kolizję dla pozycji w pionie oraz poziomie.
     * Jeśli drugie ciało jest {@link CircularBody | okrągłe}, zleca sprawdzenie funkcji isRectAndCircleColliding().
     * 
     * @param body - Ciało z którym sprawdzana jest kolizja
     * @param offset - Ochylenie ciała od orginalnej pozycji
     * @returns Czy ciała ze sobą kolidują
     */
    isColliding(body: Body, offset: XYVar = { x: 0, y: 0 }): boolean {
        if(body instanceof RectangularBody) {
            return this.position.x + offset.x + this.size.x / 2 >= body.position.x - body.size.x / 2 && this.position.x + offset.x - this.size.x / 2 <= body.position.x + body.size.x / 2 &&
                this.position.y + offset.y + this.size.y / 2 >= body.position.y - body.size.y / 2 && this.position.y + offset.y - this.size.y / 2 <= body.position.y + body.size.y / 2
        } else if(body instanceof CircularBody) {
            return isRectAndCircleColliding(this, body, offset)
        } else return false
    }

    /**
     * Przesuwa ciało o daną odległość.
     * 
     * @param by - Odległość o jaką ciało ma być przesunięte
     */
    moveBy(by: XYVar) { this.position = { x: this.position.x + by.x, y: this.position.y + by.y } }
}
/**
 * Klasa opisująca zachowanie dla {@link Body | ciała} w kształcie okręgu.
 */
export class CircularBody implements Body {
    /**
     * Pozycja ciała w układzie współrzędnych.
     */
    position: XYVar
    /**
     * promień ciała, nie może być negatywny
     */
    radius: number
    /**
     * Prędkość z jaką przemieszcza się ciało.
     */
    speed: XYVar = { x: 0, y: 0 }
    /**
     * Przyspieszenie jakie posiada ciało.
     */
    acceleration: XYVar = { x: 0, y: 0 }
    /**
     * Wartość określająca czy ciało ma byc sprawdzane pod względem kolizji.
     */
    isCollidable: boolean
    /**
     * Wartośc określająca czy ciało ma się odbijać.
     */
    isBouncy: boolean

    /**
     * Tworzy ciało w kształcie okręgu, nadaje mu pozycję startową i promień.
     * Upewnia się że długość promienia jest pozytywna.
     * 
     * @param position 
     * @param radius 
     */
    constructor(
        position: XYVar,
        radius: number,
        isCollidable: boolean = false,
        isBouncy: boolean = false
    ) {
        this.position = position
        this.radius = Math.abs(radius)

        this.isCollidable = isCollidable
        this.isBouncy = isBouncy
    }

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
     update(delta: number, colliders?: Array<Body>) {
        this.speed = addXYvars(this.speed, multiplyXYVar(this.acceleration, delta))

        if(this.isCollidable && this.isBouncy) {
            if(colliders?.some((body) => this.isColliding(body, { x: this.speed.x * delta, y: 0 }))) {
                this.speed.x *= -1
                this.acceleration.x *= -1
            }
            if(colliders?.some((body) => this.isColliding(body, { x: 0, y: this.speed.y * delta }))) {
                this.speed.y *= -1
                this.acceleration.y *= -1
            }

            this.moveBy(multiplyXYVar(this.speed, delta))
        } else this.moveBy(multiplyXYVar(this.speed, delta))
    }

    /**
     * Sprawdza czy ciała ze sobą kolidują.
     * Jeśli drugie ciało jest okrągłe, sprawdza czy odległość między ich środkami jest mniejsza niż suma ich promieni.
     * Jeśli drugie ciało jest {@link RectangularBody | prostokątne}, zleca sprawdzenie funkcji isRectAndCircleColliding().
     * 
     * @param body - Ciało z którym sprawdzana jest kolizja
     * @param offset - Ochylenie ciała od orginalnej pozycji
     * @returns Czy ciała ze sobą kolidują
     */
    isColliding(body: Body, offset: XYVar = { x: 0, y: 0 }): boolean {
        if(body instanceof RectangularBody) {
            return isRectAndCircleColliding(body, this, multiplyXYVar(offset, -1))
        } else if(body instanceof CircularBody) {
            return this.radius + body.radius >= distanceAB(addXYvars(this.position, offset), body.position)
        } else return false
    }

    /**
     * Przesuwa ciało o daną odległość.
     * 
     * @param by - Odległość o jaką ciało ma być przesunięte
     */
    moveBy(by: XYVar) { this.position = { x: this.position.x + by.x, y: this.position.y + by.y } }
}

/**
 * Sprawdza czy ciało prostokątne i okrąłe ze sobą kolidują.
 * Najpierw algorytm oblicza odległość środka okręgu od środka prostokąta.
 * Następnie algorytm sprawdza czy nastąpił 1 z 2 prostych do sprawdzenia przypadków, tj. czy okrąg jest zbyt daleko aby stykać się z prostokątem, lub zbyt blisko aby się z nim nie stykać.
 * Na końcu algorytm sprawdza czy okrąg styka się z wierzchołkami prostokąta.
 * 
 * @param rect - Ciało prostokątne
 * @param circle - Ciało okrągłe
 * @param offset - Ochylenie ciała prostokątnego od orginalnej pozycji
 * @returns Czy ciałą ze sobą kolidują
 */
export function isRectAndCircleColliding(rect: RectangularBody, circle: CircularBody, offset = { x: 0, y: 0 }): boolean {
    const circleDistance = { x: Math.abs(circle.position.x - rect.position.x - offset.x), y: Math.abs(circle.position.y - rect.position.y - offset.y) }

    if(circleDistance.x > (rect.size.x / 2 + circle.radius)) return false
    if(circleDistance.y > (rect.size.y / 2 + circle.radius)) return false

    if(circleDistance.x <= (rect.size.x / 2)) return true
    if(circleDistance.y <= (rect.size.y / 2)) return true

    return (Math.pow(circleDistance.x - rect.size.x / 2, 2) + Math.pow(circleDistance.y - rect.size.y / 2, 2)) <= (circle.radius * circle.radius)
}