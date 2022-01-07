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