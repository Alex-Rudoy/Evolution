import { lerp } from './lerp';

/**
 * Returns a random number between two values
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @example
 * randomBetween(0, 10) // some float value between 0 and 10
 */

export const randomBetween = (min: number, max: number) =>
  lerp(Math.random(), min, max);
