import { isString } from '@finsweet/ts-utils';

/**
 * Tries to extract a number value from an element's text.
 * If not valid, returns null.
 *
 * @param numberElement
 *
 * @returns Either a valid number or null.
 */
export const extractNumberFromElement = (numberElement: Element) => {
  const { textContent } = numberElement;
  if (!textContent) return null;

  const number = Number(textContent);

  return isNaN(number) ? null : number;
};

/**
 * Converts a count value to a string.
 * @param value The value to convert.
 * @param locale The locale to use. if existing.
 */
export const valueToString = (value: number, locale?: string | true) => {
  if (locale) {
    return value.toLocaleString(isString(locale) ? locale : undefined);
  }

  return value.toString();
};
