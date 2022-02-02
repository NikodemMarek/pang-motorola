import { XYVar } from '../../types'
import { addXYvars, distanceAB, divideXYVar, magnitude, multiplyXYVar, multiplyXYVars, normalize, rotate } from './utils'

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
     * Przyspieszenia jakie posiada ciało.
     */
    accelerators: Array<{ name: string, vector: XYVar }>,
    /**
     * Wartość określająca czy ciało ma byc sprawdzane pod względem kolizji.
     */
    isCollidable: boolean,
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
    moveBy: (by: XYVar) => void,
    /**
     * Dodaje przyspieszenie z identyfikatorem do ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     * @param vector - Wektor przyspieszenia
     */
    accelerate: (name: string, vector: XYVar) => void,
    /**
     * Usuwa wszystkie przyspieszenia z danym identyfikatorem, z ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     */
     decelerate: (name: string) => void
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
     * Przyspieszenia jakie posiada ciało.
     */
    accelerators: Array<{ name: string, vector: XYVar }> = [ { name: 'initial', vector: { x: 0, y: 0 } } ]
    /**
     * Wartość określająca czy ciało ma byc sprawdzane pod względem kolizji.
     */
    isCollidable: boolean

    /**
     * Tworzy ciało w kształcie prostokąta, nadaje mu pozycję startową i wymiary.
     * Upewnia się że wymiary są pozytywe.
     * 
     * @param position - Pozycja startowa ciała, umieszczona w jego centrum
     * @param size - Rozmiar ciała
     * @param isCollidable - Czy ciało będzie wchodzić w kolizje
     */
    constructor(
        position: XYVar,
        size: XYVar,
        isCollidable: boolean = false
    ) {
        this.position = position
        this.size = { x: Math.abs(size.x), y: Math.abs(size.y) }

        this.isCollidable = isCollidable
    }

    /**
     * Funkcja która będzie zmieniać wartości parametrów ciała w zależności od czasu.
     * Zmienia prędkość ciała o przyspieszenia i przesuwa je.
     * Jeśli ciało może wchodzić w kolizje, sprawdza czy nastąpiła kolizja i jeśli nastąpiła, przsuwa je poza obiekt z którym koliduje.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
    update(delta: number, colliders?: Array<Body>) {
        this.speed = addXYvars(this.speed, multiplyXYVar(addXYvars(... this.accelerators.map(acc => acc.vector)), delta))
        this.moveBy(multiplyXYVar(this.speed, delta))

        if(this.isCollidable) {
            colliders?.forEach(collider => {
                if(collider instanceof RectangularBody && this.isColliding(collider)) {
                    const nearestApex = {
                        x: Math.max(collider.position.x - collider.size.x / 2, Math.min(this.position.x, collider.position.x + collider.size.x / 2)),
                        y: Math.max(collider.position.y - collider.size.y / 2, Math.min(this.position.y, collider.position.y + collider.size.y / 2))
                    }
                    const distance: XYVar = { x: this.position.x - nearestApex.x, y: this.position.y - nearestApex.y }
                
                    const penetrationDepth = magnitude(multiplyXYVars(normalize(distance), divideXYVar(this.size, 2))) - magnitude(distance)
                    const penetrationVector = multiplyXYVar(normalize(distance), penetrationDepth)
                    this.position = addXYvars(this.position, penetrationVector)

                    if(penetrationVector.x != 0) this.speed.x = 0
                    if(penetrationVector.y != 0) this.speed.y = 0
                }
            })
        }
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
            return this.position.x + this.size.x / 2 > body.position.x - body.size.x / 2 && this.position.x - this.size.x / 2 < body.position.x + body.size.x / 2 &&
                this.position.y + this.size.y / 2 > body.position.y - body.size.y / 2 && this.position.y - this.size.y / 2 < body.position.y + body.size.y / 2
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

    /**
     * Dodaje przyspieszenie z identyfikatorem do ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     * @param vector - Wektor przyspieszenia
     */
    accelerate(name: string, vector: XYVar) { this.accelerators.push({ name: name, vector: vector }) }
    /**
     * Usuwa wszystkie przyspieszenia z danym identyfikatorem, z ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     */
    decelerate(name: string) { this.accelerators = this.accelerators.filter(acc => acc.name != name) }
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
     * Przyspieszenia jakie posiada ciało.
     */
    accelerators: Array<{ name: string, vector: XYVar }> = [ { name: 'initial', vector: { x: 0, y: 0 } } ]
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
     * @param position - Pozycja startowa ciała, umieszczona w jego centrum
     * @param radius - Promień ciała
     * @param isCollidable - Czy ciało będzie wchodzić w kolizje
     * @param isBouncy - Czy ciało będzie się odbijać
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
     * Zmienia prędkość ciała o przyspieszenia i przesuwa je.
     * Jeśli ciało może wchodzić w kolizje, sprawdza czy nastąpiła kolizja i jeśli nastąpiła, przsuwa je poza obiekt z którym koliduje.
     * 
     * @param delta - Czas jaki wyświetlana była poprzednia klatka
     * @param colliders - Tablica z ciałami które mogą kolidować z tym ciałem
     */
     update(delta: number, colliders?: Array<Body>) {
        this.speed = addXYvars(this.speed, multiplyXYVar(addXYvars(... this.accelerators.map(acc => acc.vector)), delta))

        this.moveBy(multiplyXYVar(this.speed, delta))

        if(colliders != undefined) colliders.forEach(rect => { if(rect instanceof RectangularBody && isRectAndCircleColliding(rect, this)) resolveRectAndCirclePenetration(rect as RectangularBody, this) })
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

    /**
     * Dodaje przyspieszenie z identyfikatorem do ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     * @param vector - Wektor przyspieszenia
     */
    accelerate(name: string, vector: XYVar) { this.accelerators.push({ name: name, vector: vector }) }
    /**
     * Usuwa wszystkie przyspieszenia z danym identyfikatorem, z ciała.
     * 
     * @param name - Identyfikator przyspieszenia
     */
    decelerate(name: string) { this.accelerators = this.accelerators.filter(acc => acc.name != name) }
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

/**
 * Obolicza jak głęboko ciało okrągłe spenetrowało ciało prostokątne.
 * Odbija ciało okrągłe na głębokość penetracji.
 * Zmienia wektor prędkości oraz wektory przyspieszenia ciała okrągłego, na wektory odbity.
 * 
 * @param rect - Ciało prostokątne od którego odbija się ciało okrągłe
 * @param circle - Ciało okrągłe które się porusza
 */
export function resolveRectAndCirclePenetration(rect: RectangularBody, circle: CircularBody) {
    const nearestApex = {
        x: Math.max(rect.position.x - rect.size.x / 2, Math.min(circle.position.x, rect.position.x + rect.size.x / 2)),
        y: Math.max(rect.position.y - rect.size.y / 2, Math.min(circle.position.y, rect.position.y + rect.size.y / 2))
    }
    const distance: XYVar = { x: circle.position.x - nearestApex.x, y: circle.position.y - nearestApex.y }

    const dnormal = { x: -distance.y, y: distance.x }
    const normal_angle = Math.atan2(dnormal.y, dnormal.x)
    const incoming_angle = Math.atan2(circle.speed.y, circle.speed.x)
    const theta = normal_angle - incoming_angle

    const penetrationDepth = circle.radius - magnitude(distance)
    const penetrationVector = multiplyXYVar(normalize(distance), penetrationDepth)
    circle.position = addXYvars(circle.position, penetrationVector)

    if(circle.isBouncy) {
        circle.speed = rotate(circle.speed, 2 * theta)
        circle.accelerators = circle.accelerators.map(acc => {
            if(acc.name == 'gravity') {
                circle.speed = addXYvars(circle.speed, acc.vector)
                return { name: acc.name, vector: acc.vector }
            }
            else return { name: acc.name, vector: rotate(acc.vector, 2 * theta) }
        })
    } else {
        if(penetrationVector.x != 0) circle.speed.x = 0
        if(penetrationVector.y != 0) circle.speed.y = 0
    }
}