/**
 * Math utilities module.
 * Provides commonly used math functions and constants.
 * @module mathUtils
 */

/**
 * The value of half Pi (π/2).
 * @type {number}
 * @constant
 */
export const HALF_PI = 0.5 * Math.PI;

/**
 * The value of Tau (τ), which is equal to 2 times Pi (2π).
 * @type {number}
 * @constant
 */
export const TAU = 2 * Math.PI;

/**
 * Converts an angle from degrees to radians.
 * @param {number} degrees - The angle in degrees.
 * @returns {number} The angle in radians.
 */
export const degreesToRadians = (degrees: number) => degrees * (Math.PI / 180);

/**
 * Floors a number to the largest integer less than or equal to it.
 * @param {number} n - The number.
 * @returns {number} The floored integer.
 */
export const floor = (n: number) => Math.floor(n);

/**
 * Generates a random number multiplied by the given value.
 * @param {number} n - The multiplier.
 * @returns {number} The random number.
 */
export const randomWithMultiplier = (n: number) => n * Math.random();

/**
 * Generates a random number in the specified range.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} The random number.
 */
export const randomInRange = (min: number, max: number) =>
  Math.random() * (max - min) + min;

/**
 * Generates a random number in the range [-n, n].
 * @param {number} n - The range limit.
 * @returns {number} The random number.
 */
export const randomRange = (n: number) => Math.random() * 2 * n - n;




