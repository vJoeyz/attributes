/**
 * Matches when a string is wrapped between double brackets.
 * @example ```
 * {{component-name}}
 * {{component-name="/page-path"}}
 * ```
 */
export const COMPONENT_TEMPLATE_REGEX = /\{\{.*?\}\}/g;

/**
 * Matches when a string contains a `="VALUE"` pattern.
 * @example ="/page-path"
 */
export const EXTERNAL_COMPONENT_REGEX = /\=\".*?\"/g;

/**
 * Matches when a string ends with a trailing slash.
 * @example https://www.finsweet.com/
 */
export const TRAILING_SLASH_REGEX = /\/+$/;
