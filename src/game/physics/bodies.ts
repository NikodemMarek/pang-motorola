import { XYVar } from '../../types'
import { distanceAB } from './utils'

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
     * Tworzy ciało w kształcie prostokąta, nadaje mu pozycję startową i wymiary.
     * Upewnia się że wymiary są pozytywe.
     * 
     * @param position - Pozycja startowa ciała, umieszczona w jego centrum
     * @param size - Rozmiar ciała
     */
    constructor(
        position: XYVar,
        size: XYVar
    ) {
        this.position = position
        this.size = { x: Math.abs(size.x), y: Math.abs(size.y) }
    }

    /**
     * Sprawdza czy ciała ze sobą kolidują.
     * Jeśli drugie ciało jest prostokątne, sprawdza kolizję dla pozycji w pionie oraz poziomie.
     * Jeśli drugie ciało jest {@link CircularBody | okrągłe}, zleca sprawdzenie funkcji isRectAndCircleColliding().
     * 
     * @param body - Ciało z którym sprawdzana jest kolizja
     * @returns Czy ciała ze sobą kolidują
     */
    isColliding(body: Body): boolean {
        if(body instanceof RectangularBody) {
            return this.position.x + this.size.x / 2 >= body.position.x - body.size.x / 2 && this.position.x - this.size.x / 2 <= body.position.x + body.size.x / 2 &&
                this.position.y + this.size.y / 2 >= body.position.y - body.size.y / 2 && this.position.y - this.size.y / 2 <= body.position.y + body.size.y / 2
        } else if(body instanceof CircularBody) {
            return isRectAndCircleColliding(this, body)
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
     * Tworzy ciało w kształcie okręgu, nadaje mu pozycję startową i promień.
     * Upewnia się że długość promienia jest pozytywna.
     * 
     * @param position 
     * @param radius 
     */
    constructor(
        position: XYVar,
        radius: number
    ) {
        this.position = position
        this.radius = Math.abs(radius)
    }

    /**
     * Sprawdza czy ciała ze sobą kolidują.
     * Jeśli drugie ciało jest okrągłe, sprawdza czy odległość między ich środkami jest mniejsza niż suma ich promieni.
     * Jeśli drugie ciało jest {@link RectangularBody | prostokątne}, zleca sprawdzenie funkcji isRectAndCircleColliding().
     * 
     * @param body - Ciało z którym sprawdzana jest kolizja
     * @returns Czy ciała ze sobą kolidują
     */
    isColliding(body: Body): boolean {
        if(body instanceof RectangularBody) {
            return isRectAndCircleColliding(body, this)
        } else if(body instanceof CircularBody) {
            return this.radius + body.radius >= distanceAB(this.position, body.position)
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
 * @returns Czy ciałą ze sobą kolidują
 */
export function isRectAndCircleColliding(rect: RectangularBody, circle: CircularBody): boolean {
    const circleDistance = { x: Math.abs(circle.position.x - rect.position.x), y: Math.abs(circle.position.y - rect.position.y) }

    if(circleDistance.x > (rect.size.x / 2 + circle.radius)) return false
    if(circleDistance.y > (rect.size.y / 2 + circle.radius)) return false

    if(circleDistance.x <= (rect.size.x / 2)) return true
    if(circleDistance.y <= (rect.size.y / 2)) return true

    return (Math.pow(circleDistance.x - rect.size.x / 2, 2) + Math.pow(circleDistance.y - rect.size.y / 2, 2)) <= (circle.radius * circle.radius)
}