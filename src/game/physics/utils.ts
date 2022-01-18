import { XYVar } from '../../types'

/**
 * Oblicza odległość między punktami A i B w układzie współrzędnych.
 * 
 * @param a - Pozycja punktu A
 * @param b - Pozycja punktu B
 * @returns Odległość między punktami
 */
export const distanceAB = (a: XYVar, b: XYVar): number => Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2))

/**
 * Zwraca dodane do siebie wszystkie wartości.
 * 
 * @param a - Wartości do dodania
 * @returns Sumaryczna wartość wszystkich wartości
 */
export const addXYvars = (... vars: Array<XYVar>): XYVar => { return vars.reduce((result, a) => { return { x: result.x + a.x, y: result.y + a.y } }) }
/**
 * Zwraca 2 wymiarową wartość a wymnożoną przez b.
 * 
 * @param a - Wartość do wymnożenia
 * @param b - Wartość przez którą zostanie wymnożone a
 * @returns Wymnożona wartość
 */
export const multiplyXYVar = (a: XYVar, b: number): XYVar => { return { x: a.x * b, y: a.y * b }  }
/**
 * Zwraca 2 wymiarową wartość a podzieloną przez b.
 * 
 * @param a - Wartość do podzielenia
 * @param b - Wartość przez którą zostanie podzielone a
 * @returns Podzielona wartość
 */
export const divideXYVar = (a: XYVar, b: number): XYVar => { return { x: a.x / b, y: a.y / b }  }
/**
 * Zwraca pomnożone przez siebie wartości.
 * 
 * @param a - Wartości do pomnożenia
 * @returns Wymnożona wartość
 */
export const multiplyXYVars = (... vars: Array<XYVar>): XYVar => { return vars.reduce((result, a) => { return { x: result.x * a.x, y: result.y * a.y } }) }

/**
 * Zwraca 2 wymiarową wartość a podzieloną przez 2 wymiarową wartość b.
 * 
 * @param a - Wartość do podzielenia
 * @param b - Wartość przez którą zostanie podzielone a
 * @returns Podzieloną wartość
 */
export const divideXYVars = (a: XYVar, b: XYVar): XYVar => { return { x: a.x / b.x, y: a.y / b.y }  }

/**
 * Oblicza długość wektora.
 * 
 * @param vector - Wektor
 * @returns Długość wektora
 */
export const magnitude = (vector: XYVar): number => Math.sqrt(vector.x * vector.x + vector.y * vector.y)
/**
 * Normalizuje wektor, dzieląc jego wymiary przez jego długość.
 * 
 * @param vector - Wektor do znormalizowania
 * @returns Znormalizowany wektor
 */
export const normalize = (vector: XYVar): XYVar => divideXYVar(vector, magnitude(vector))

/**
 * Zwraca nowy wektor, po obróceniu o podany kąt.
 * 
 * @param vector - Wektor do obrócenia
 * @param angle - Kąt o którzy zostanie obrócony wektor, wyrażony w radianach
 * @returns Obrócony wektor
 */
export const rotate = (vector: XYVar, angle: number): XYVar => {
    return {
        x: vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
        y: vector.x * Math.sin(angle) + vector.y * Math.cos(angle)
    }
}