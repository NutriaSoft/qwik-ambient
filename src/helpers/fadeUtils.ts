/**
 * @module FadeUtils
 * Provides commonly used fade functions.
 */


/**
 * Calculates the fade-in value based on the current time and the total duration.
 * @param {number} t - The current time.
 * @param {number} m - The total duration.
 * @returns {number} The fade-in value.
 */
export const calculateFadeIn = (t: number, m: number) => t / m;

/**
 * Calculates the fade-out value based on the current time and the total duration.
 * @param {number} t - The current time.
 * @param {number} m - The total duration.
 * @returns {number} The fade-out value.
 */
export const calculateFadeOut = (t: number, m: number) => (m - t) / m;


/**
 * Calculates the fade-in/fade-out value based on the current time and the total duration.
 * @param {number} t - The current time.
 * @param {number} m - The total duration.
 * @returns {number} The fade-in/fade-out value.
 */
export const calculateFadeInOut = (t: number, m: number) => {
  const halfM = 0.5 * m;
  return Math.abs((t + halfM) % m - halfM) / halfM;

};