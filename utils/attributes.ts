import { ATTRIBUTES_KEYS } from './constants';

/**
 * Make sure the window object is defined.
 */
window.fsAttributes ||= {};

/**
 * Checks if an Attributes' `<script>` should prevent automatically loading the library.
 * Useful for cases where a JS developer whants to programatically init the library.
 * @param script The `<script>` element.
 * @returns `true` if the library should not automatically load.
 */
// prettier-ignore
export const preventsLoad = (script: HTMLOrSVGScriptElement | null): boolean => typeof script?.getAttribute(ATTRIBUTES_KEYS.preventLoad) === 'string';

/**
 * Creates a dynamic attribute value.
 * @param value The static attribute value.
 * @returns A callback for generating new attribute values by index.
 */
export const createDynamicAttibuteValue = (value: string) => {
  return (index?: number): string => `${value}${index ? `-${index}` : ''}`;
};
