/**
 * Normalizes a value between a min and max value.
 * @param {number} value - The value to normalize
 * @param {number} min - The minimum value
 * @param {number} max - The maximum value
 * @example
 * norm(0.5, 0, 10) // 0.05
 * norm(0.5, 10, 0) // 0.95
 * norm(0.5, 0, 0) // 0
 */
export const norm = (value: number, min: number, max: number) =>
  (value - min) / (max - min);
