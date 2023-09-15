/**
 * Normalizes a field key.
 * - Trims the string.
 * - Lowercases the string.
 *
 * @param propKey The field key to normalize.
 */
export function normalizeFieldKey(propKey: string): string;
export function normalizeFieldKey(propKey?: string | null): string | undefined;
export function normalizeFieldKey(propKey?: string | null): string | undefined {
  return propKey?.trim().toLowerCase();
}
