/**
 * Matches when a string is wrapped between double brackets.
 * @example ```
 * {{component-name}}
 * {{component-name="/page-path"}}
 * ```
 */
export const HAS_COMPONENT_TEMPLATE_REGEX = /\{\{.*?\}\}/;

/**
 * Matches when a string contains a `="VALUE"` pattern.
 * @example ="/page-path"
 */
export const IS_EXTERNAL_COMPONENT_REGEX = /\=\".*?\"/;

/**
 * Matches when a string contains a `<` and a `>`.
 * @example```
 * <div class="test"> // Matches!
 * The quick brown <span style="red">fox</span>. // Matches!
 * ```
 */
export const HAS_HTML_OPENING_TAG_REGEX = /\&lt\;.*?\&gt\;/;

/**
 * Matches when a string starts with `<` and ends with `>`.
 * @example```
 * <div class="test"> // Matches!
 * The quick brown <span style="red">fox</span>. // Doesn't match!
 * ```
 */
export const IS_HTML_OPENING_TAG_REGEX = /^\&lt\;.*?\&gt\;$/;

/**
 * Matches when a string ends with a trailing slash.
 * @example https://www.finsweet.com/
 */
export const TRAILING_SLASH_REGEX = /\/+$/;
