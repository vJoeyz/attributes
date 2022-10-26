/**
 * Converts a string to a number, removing any invalid symbols like `$` or `,`.
 * @param value A string number.
 * @returns The valid number value.
 */
export const normalizeNumber = (value: string) => {
  if (!value) return;

  return parseFloat(value.replace(/[^0-9.-]+/g, ''));
};

/**
 * Parses a numeric Attribute string.
 * @param rawValue The raw string. Example: "20", "-25.3"...
 * @param fallback A value to fall back to when the parsed value is not valid.
 */
export function parseNumericAttribute(rawValue: string | null, fallback: number): number;
export function parseNumericAttribute(rawValue: string | null, fallback: number | null): number | null;
export function parseNumericAttribute(rawValue: string | null, fallback?: number | null): number | null {
  if (!rawValue) return fallback ?? null;

  const value = Number(rawValue);

  if (!isNaN(value)) return value;
  if (fallback) return fallback;
  return null;
}
