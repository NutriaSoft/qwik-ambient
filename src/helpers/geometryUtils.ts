/**
 * @module geometryUtils
 * Provides commonly used geometry functions.
 */



/**
 * Calculates the distance between two points in a 2D plane.
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The distance between the two points.
 */
export const calculateDistance = (x1: number, y1: number, x2: number, y2: number) =>
  Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

/**
 * Calculates the angle (in radians) between two points in a 2D plane.
 * @param {number} x1 - The x-coordinate of the first point.
 * @param {number} y1 - The y-coordinate of the first point.
 * @param {number} x2 - The x-coordinate of the second point.
 * @param {number} y2 - The y-coordinate of the second point.
 * @returns {number} The angle between the two points in radians.
 */
export const calculateAngle = (x1: number, y1: number, x2: number, y2: number) => Math.atan2(y2 - y1, x2 - x1);

/**
 * Performs linear interpolation between two numbers based on a given speed.
 * @param {number} n1 - The first number.
 * @param {number} n2 - The second number.
 * @param {number} speed - The interpolation speed (0 to 1).
 * @returns {number} The interpolated number.
 */
export const performLinearInterpolation = (n1: number, n2: number, speed: number) =>
  (1 - speed) * n1 + speed * n2;
