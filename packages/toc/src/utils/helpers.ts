/**
 * Extracts the heading level from a heading tag.
 * @param value The heading tag.
 *
 * @example ```
 * extractHeadingLevel('h2') // 2
 * extractHeadingLevel('h5') // 5
 * extractHeadingLevel('5') // 5
 * extractHeadingLevel('hh') // undefined
 * ```
 *
 */
export const extractHeadingLevel = (value: string) => {
  const rawLevel = value.match(/\d/)?.[0];
  if (!rawLevel) return;

  const level = parseInt(rawLevel);
  if (isNaN(level)) return;

  return level;
};
