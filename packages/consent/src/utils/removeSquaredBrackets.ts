/**
 * Removes square brackets from a string.
 * @param {string} item - The input string to clean up.
 * @returns {string} - The string with square brackets removed.
 */
export const removeSquaredBrackets = (item: string) => item.replace(/\[|\]/g, '');
