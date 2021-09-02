/**
 * Window object.
 */
declare global {
  interface Window {
    fsAttributes: {
      [key: string]: unknown;
    };
  }
}

window.fsAttributes ||= {};

/**
 * Constants
 */
const ATTRIBUTES_PREFIX = 'fs-attributes';

const ATTRIBUTES_KEYS = {
  /**
   * Defines if an Attributes' `<script>` should prevent automatically loading the library.
   */
  preventLoad: `${ATTRIBUTES_PREFIX}-preventload`,
};

/**
 * Checks if an Attributes' `<script>` should prevent automatically loading the library.
 * Useful for cases where a JS developer whants to programatically init the library.
 * @param script The `<script>` element.
 * @returns `true` if the library should not automatically load.
 */
// prettier-ignore
export const preventLoad = (script: HTMLOrSVGScriptElement | null): boolean => typeof script?.getAttribute(ATTRIBUTES_KEYS.preventLoad) === 'string';
