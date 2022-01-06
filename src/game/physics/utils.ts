import { XYVar } from '../../types'

/**
 * Oblicza odległość między punktami A i B w układzie współrzędnych.
 * 
 * @param a - Pozycja punktu A
 * @param b - Pozycja punktu B
 * @returns Odległość między punktami
 */
export const distanceAB = (a: XYVar, b: XYVar): number => Math.sqrt(Math.pow(Math.abs(a.x - b.x), 2) + Math.pow(Math.abs(a.y - b.y), 2))