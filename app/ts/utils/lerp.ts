/**
 * Linear interpolation - returns a value between start and end based on value 0..1
 * @param {number} value - The value between 0 and 1 to interpolate
 * @param {number} start - The start value
 * @param {number} end - The end value
 * @example
 * lerp(0.5, 0, 10) // 5
 * lerp(0.5, 10, 0) // 5
 * lerp(0.5, 0, 0) // 0
 */
export const lerp = (value: number, start: number, end: number) =>
  (Math.max(end, start) - Math.min(end, start)) * value + Math.min(end, start);
